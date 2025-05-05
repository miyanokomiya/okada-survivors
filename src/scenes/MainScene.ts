import { Application, Texture, Ticker, TilingSprite } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { lerpValue, Vec2 } from "../utils/geo";
import { getBackgroundContainer, getHudContaienr, getPlayerContaienr, initContainers } from "../utils/containers";
import { CEnemySpawner } from "../components/CEnemySpawner";
import { createWeightedTable } from "../utils/WeightedTable";
import { CTimer } from "../components/CTimer";
import { GameTimerLabel } from "../entities/widgets/GameTimerLabel";
import { ExpBar } from "../entities/widgets/ExpBar";
import { PlayerStatus } from "../entities/widgets/PlayerStatus";
import { UpgradeMenu } from "../entities/widgets/UpgradeMenu";
import { CUpgrade } from "../components/CUpgrade";
import { initTickLayers, isPausedLayerMain } from "../utils/tickLayers";
import { CCamera } from "../components/CCamera";
import background from "../assets/background.svg";

export class MainScene extends SceneBase {
  camera: CCamera;
  backgroundSprite: TilingSprite;
  player: Player;
  enemySpawner: CEnemySpawner;
  gameTimer: CTimer;
  gameTimerLabel: GameTimerLabel;
  expBar: ExpBar;
  playerStatus: PlayerStatus;
  upgradeComponent: CUpgrade;
  upgradeMenu: UpgradeMenu;

  constructor(app: Application) {
    super(app);

    this.gameTimer = new CTimer(60 * 60 * 3);
    this.gameTimer.start();
    this.gameTimer.onFinish = () => {
      console.log("Game Over");
      this.restart();
    };

    initTickLayers(app);
    initContainers(app);

    this.backgroundSprite = new TilingSprite({
      texture: Texture.from(background),
      width: app.screen.width,
      height: app.screen.height,
      alpha: 0.5,
    });
    getBackgroundContainer(app)?.addChild(this.backgroundSprite);

    this.player = new Player(app);
    this.player.container.x = app.screen.width / 2;
    this.player.container.y = app.screen.height / 2;
    this.player.spawn(getPlayerContaienr(app));

    this.camera = new CCamera(app);
    this.camera.setTarget(this.player.container);

    this.enemySpawner = new CEnemySpawner(app, createWeightedTable([{ item: EnemyTeki, weight: 1 }]));

    const hudContainer = getHudContaienr(app);
    this.gameTimerLabel = new GameTimerLabel(app);
    this.gameTimerLabel.container.x = app.screen.width / 2 - this.gameTimerLabel.container.width / 2;
    this.gameTimerLabel.container.y = 0;
    this.gameTimerLabel.spawn(hudContainer);

    this.expBar = new ExpBar(app, this.player.expLevel);
    this.expBar.spawn(hudContainer);
    this.playerStatus = new PlayerStatus(app, this.player);
    this.playerStatus.spawn(hudContainer);

    this.upgradeComponent = new CUpgrade(app);
    this.upgradeComponent.eventUpgradeSelected.add((upgrade) => {
      this.player.upgrade(upgrade);
    });
    this.upgradeMenu = new UpgradeMenu(app, this.upgradeComponent);
    this.upgradeMenu.spawn(hudContainer);

    this.player.expLevel.eventLevelup.add(() => {
      this.upgradeMenu.display();
    });
  }

  destroy() {
    super.destroy();
  }

  tick(time: Ticker) {
    if (isPausedLayerMain(this.app)) return;

    if (!this.player.health.isAlive()) {
      console.log("Player is dead");
      this.restart();
      return;
    }

    const movement = getPlayerMovement(this.keyState);
    this.player.movement.accelerate(movement);
    this.camera.tick(time.deltaTime);
    this.backgroundSprite.tilePosition.x = this.camera.cameraContainer.position.x;
    this.backgroundSprite.tilePosition.y = this.camera.cameraContainer.position.y;
    this.enemySpawner.setLevel(Math.floor(lerpValue(1, 20, this.gameTimer.getProgress())));
    this.enemySpawner.tick(time.deltaTime);
    this.gameTimer.tick(time.deltaTime);
    this.gameTimerLabel.update(this.gameTimer.currentTime, this.enemySpawner.level);
  }
}

function getPlayerMovement(keyState: Record<string, boolean>): Vec2 {
  const movement = { x: 0, y: 0 };
  if (keyState["ArrowUp"] || keyState["w"]) {
    movement.y -= 1;
  }
  if (keyState["ArrowDown"] || keyState["s"]) {
    movement.y += 1;
  }
  if (keyState["ArrowLeft"] || keyState["a"]) {
    movement.x -= 1;
  }
  if (keyState["ArrowRight"] || keyState["d"]) {
    movement.x += 1;
  }
  return movement;
}
