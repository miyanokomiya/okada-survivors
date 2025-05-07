import { Application, Texture, Ticker, TilingSprite } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { lerpValue, Vec2 } from "../utils/geo";
import {
  getBackgroundContainer,
  getEnemyContaienr,
  getFieldContainer,
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
import { VirtualJoystick } from "../components/VirtualJoystick";
import { AscensionScene } from "./AscensionScene";
import { applyExMaxLevel, applyExWeakPoolRate } from "../utils/globalSettings";
import { EnemyTobi } from "../entities/enemies/EnemyTobi";
import { Wall } from "../entities/Wall";

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
  joystick: VirtualJoystick;
  maxLevel = applyExMaxLevel(20);

  private wallSpacing = 400;
  private wallLineCount = 4;
  private wallSize = 30;
  private walls: Wall[] = [];

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
          { item: EnemyTeki, weight: applyExWeakPoolRate(2) },
          { item: EnemyMushi, weight: 1 },
        ]),
      ],
      [
        6,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(4) },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
        ]),
      ],
      [
        9,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(3) },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
          { item: EnemyTobi, weight: 1 },
        ]),
      ],
      [
        12,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(3) },
          { item: EnemyMushi, weight: 3 },
          { item: EnemyDai, weight: 2 },
          { item: EnemyTobi, weight: 2 },
        ]),
      ],
      [
        15,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(1) },
          { item: EnemyMushi, weight: 1 },
          { item: EnemyDai, weight: 2 },
          { item: EnemyTobi, weight: 2 },
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
    this.clearMenu.eventAscension.add(() => {
      this.destroy();
      new AscensionScene(app);
    });

    this.joystick = new VirtualJoystick(50, app.screen.width, app.screen.height);
    app.stage.addChild(this.joystick.getContainer());

    this.initWalls();
  }

  initWalls() {
    const fieldContainer = getFieldContainer(this.app);
    const screenSize = Math.max(this.app.screen.width, this.app.screen.height);
    this.wallLineCount = Math.ceil((2 * screenSize) / this.wallSpacing);
    [...Array(this.wallLineCount ** 2)].forEach(() => {
      const wall = new Wall(this.app, this.wallSize);
      wall.spawn(fieldContainer);
      this.walls.push(wall);
    });
    this.replaceWalls();
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

    const keyboardMovement = getPlayerMovement(this.keyState);
    const joystickMovement = this.joystick.getMovement();

    const movement = {
      x: keyboardMovement.x + joystickMovement.x,
      y: keyboardMovement.y + joystickMovement.y,
    };

    this.player.accelerate(movement);
    this.camera.tick(time.deltaTime);
    this.backgroundSprite.tilePosition.x = this.camera.cameraContainer.position.x;
    this.backgroundSprite.tilePosition.y = this.camera.cameraContainer.position.y;
    this.gameTimerLabel.update(this.gameTimer.currentTime, this.enemySpawner.level);
    this.replaceWalls();

    if (this.gameTimer.isRunning) {
      this.gameTimer.tick(time.deltaTime);
      this.enemySpawner.setLevel(Math.floor(lerpValue(1, this.maxLevel, this.gameTimer.getProgress())));
      this.enemySpawner.tick(time.deltaTime);
    }

    if (this.timeup) {
      const enemyCount = (getEnemyContaienr(this.app)?.children ?? []).length;
      if (enemyCount === 0) {
        this.clearMenu.displayClear();
      }
    }
  }

  replaceWalls() {
    const wallSpacing = this.wallSpacing;
    const wallLineCount = this.wallLineCount;
    const cameraP = this.camera.cameraContainer.position;
    const x = -wallSpacing - cameraP.x + (cameraP.x % wallSpacing);
    const y = -wallSpacing - cameraP.y + (cameraP.y % wallSpacing);

    this.walls.forEach((wall, i) => {
      wall.container.x = x + (i % wallLineCount) * wallSpacing;
      wall.container.y = y + Math.floor(i / wallLineCount) * wallSpacing;
    });
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
