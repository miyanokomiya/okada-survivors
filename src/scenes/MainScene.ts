import { Application, Texture, Ticker, TilingSprite } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { lerpValue, Vec2 } from "../utils/geo";
import {
  getBackgroundContainer,
  getEnemyContaienr,
  getHudContaienr,
  getPlayerContaienr,
  initContainers,
} from "../utils/containers";
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
import { EnemyMushi } from "../entities/enemies/EnemyMushi";
import { EnemyDai } from "../entities/enemies/EnemyDai";
import { GameOverMenu } from "../entities/widgets/GameOverMenu";

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
  clearMenu: GameOverMenu;
  private timeup = false;

  constructor(app: Application) {
    super(app);

    this.gameTimer = new CTimer(60 * 60 * 3);
    this.gameTimer.start();
    this.gameTimer.onFinish = () => {
      this.timeup = true;
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

    this.enemySpawner = new CEnemySpawner(app, [
      [1, createWeightedTable([{ item: EnemyTeki, weight: 1 }])],
      [
        3,
        createWeightedTable([
          { item: EnemyTeki, weight: 2 },
          { item: EnemyMushi, weight: 1 },
        ]),
      ],
      [
        6,
        createWeightedTable([
          { item: EnemyTeki, weight: 4 },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
        ]),
      ],
      [
        9,
        createWeightedTable([
          { item: EnemyTeki, weight: 2 },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
        ]),
      ],
      [
        12,
        createWeightedTable([
          { item: EnemyTeki, weight: 3 },
          { item: EnemyMushi, weight: 3 },
          { item: EnemyDai, weight: 2 },
        ]),
      ],
      [
        15,
        createWeightedTable([
          { item: EnemyTeki, weight: 1 },
          { item: EnemyMushi, weight: 1 },
          { item: EnemyDai, weight: 2 },
        ]),
      ],
    ]);

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

    this.clearMenu = new GameOverMenu(app);
    this.clearMenu.spawn(hudContainer);

    this.clearMenu.eventRetry.add(() => {
      this.restart();
    });
  }

  destroy() {
    super.destroy();
  }

  tick(time: Ticker) {
    if (isPausedLayerMain(this.app)) return;

    if (!this.player.health.isAlive()) {
      this.clearMenu.displayOver();
      return;
    }

    const movement = getPlayerMovement(this.keyState);
    this.player.accelerate(movement);
    this.camera.tick(time.deltaTime);
    this.backgroundSprite.tilePosition.x = this.camera.cameraContainer.position.x;
    this.backgroundSprite.tilePosition.y = this.camera.cameraContainer.position.y;
    this.gameTimerLabel.update(this.gameTimer.currentTime, this.enemySpawner.level);

    if (this.gameTimer.isRunning) {
      this.gameTimer.tick(time.deltaTime);
      this.enemySpawner.setLevel(Math.floor(lerpValue(1, 20, this.gameTimer.getProgress())));
      this.enemySpawner.tick(time.deltaTime);
    }

    if (this.timeup) {
      const enemyCount = (getEnemyContaienr(this.app)?.children ?? []).length;
      if (enemyCount === 0) {
        this.clearMenu.displayClear();
      }
    }
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
