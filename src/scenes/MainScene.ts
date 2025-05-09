import { Application, Texture, Ticker, TilingSprite } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { lerpValue } from "../utils/geo";
import {
  checkLoop,
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
import { applyExMaxLevel, applyExWallSize, applyExWeakPoolRate, globalSettings } from "../utils/globalSettings";
import { EnemyTobi } from "../entities/enemies/EnemyTobi";
import { Wall } from "../entities/Wall";
import { getDirectionalMovement, getPauseInput, getTurboInput } from "../utils/inputs";
import { EnemyRei } from "../entities/enemies/EnemyRei";
import { PauseMenu } from "../entities/widgets/PauseMenu";
import { PauseButton } from "../entities/widgets/PauseButton";

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
  pauseMenu: PauseMenu;
  clearMenu: GameOverMenu;
  joystick: VirtualJoystick;
  maxLevel = applyExMaxLevel(20);

  private loopTileSize = 300;
  private loopTileCount: number;
  private wallSpacing = 300;
  private wallLineCount: number;
  private wallSize = 12;

  private timeup = false;

  constructor(app: Application) {
    super(app);
    this.app.ticker.speed = globalSettings.tarboRate;

    this.gameTimer = new CTimer(60 * 60 * 3);
    this.gameTimer.start();
    this.gameTimer.onFinish = () => {
      this.timeup = true;
    };

    initTickLayers(app);
    initContainers(app);

    const worldScale = 3;
    this.loopTileCount = Math.ceil(
      (Math.max(800, app.screen.width, app.screen.height) / this.loopTileSize) * worldScale,
    );
    this.wallLineCount = Math.round(this.loopTileSize / this.wallSpacing) * this.loopTileCount;

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
          { item: EnemyTobi, weight: 1 },
          { item: EnemyRei, weight: 0.5 },
        ]),
      ],
      [
        10,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(4) },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
          { item: EnemyTobi, weight: 1 },
          { item: EnemyRei, weight: 0.5 },
        ]),
      ],
      [
        13,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(3) },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 1 },
          { item: EnemyTobi, weight: 1 },
          { item: EnemyRei, weight: 2 },
        ]),
      ],
      [
        16,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(3) },
          { item: EnemyMushi, weight: 2 },
          { item: EnemyDai, weight: 2 },
          { item: EnemyTobi, weight: 2 },
          { item: EnemyRei, weight: 3 },
        ]),
      ],
      [
        19,
        createWeightedTable([
          { item: EnemyTeki, weight: applyExWeakPoolRate(1) },
          { item: EnemyMushi, weight: 1 },
          { item: EnemyDai, weight: 2 },
          { item: EnemyTobi, weight: 2 },
          { item: EnemyRei, weight: 3 },
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
    this.upgradeMenu = new UpgradeMenu(app, this, this.upgradeComponent);
    this.upgradeMenu.spawn(hudContainer);

    this.player.expLevel.eventLevelup.add(() => {
      this.upgradeMenu.display();
    });

    this.pauseMenu = new PauseMenu(app, this);
    this.pauseMenu.spawn(hudContainer);

    this.clearMenu = new GameOverMenu(app, this, this.player);
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

    const pauseButton = new PauseButton(app);
    pauseButton.spawn(hudContainer);
    pauseButton.eventPause.add(() => {
      this.pauseMenu.toggle();
    });

    this.initWalls();
  }

  initWalls() {
    const fieldContainer = getFieldContainer(this.app);
    const wallLineCount = this.wallLineCount;
    const wallSpacing = this.wallSpacing;
    const randomWall = true;
    [...Array(this.wallLineCount ** 2)].forEach((_, i) => {
      const wall = new Wall(this.app, applyExWallSize(this.wallSize));
      wall.container.x = (i % wallLineCount) * wallSpacing;
      wall.container.y = Math.floor(i / wallLineCount) * wallSpacing;
      if (randomWall) {
        const r = Math.random() * 2 * Math.PI;
        const radius = Math.random() * wallSpacing * 0.3;
        wall.container.x += Math.cos(r) * radius;
        wall.container.y += Math.sin(r) * radius;
      }
      wall.spawn(fieldContainer);
    });
  }

  destroy() {
    this.app.ticker.speed = 1;
    super.destroy();
  }

  tick(time: Ticker) {
    if (getTurboInput(this.keyPressState)) {
      globalSettings.tarboRate = globalSettings.tarboRate !== 1 ? 1 : 2;
      this.app.ticker.speed = globalSettings.tarboRate;
    }

    if (getPauseInput(this.keyPressState)) {
      this.pauseMenu.toggle();
    }

    if (isPausedLayerMain(this.app)) return;

    if (!this.player.health.isAlive()) {
      this.clearMenu.displayOver();
      return;
    }

    const keyboardMovement = getDirectionalMovement(this.keyState);
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

    checkLoop(this.app, this.loopTileCount, this.loopTileSize);

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
}
