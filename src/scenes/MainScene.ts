import { Application, Ticker } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { lerpValue, Vec2 } from "../utils/geo";
import { getHudContaienr, getWidgetContaienr, initContainers } from "../utils/containers";
import { CEnemySpawner } from "../components/CEnemySpawner";
import { createWeightedTable } from "../utils/WeightedTable";
import { CTimer } from "../components/CTimer";
import { GameTimerLabel } from "../entities/widgets/GameTimerLabel";
import { ExpBar } from "../entities/widgets/ExpBar";
import { PlayerStatus } from "../entities/widgets/PlayerStatus";

export class MainScene extends SceneBase {
  player: Player;
  enemySpawner: CEnemySpawner;
  gameTimer: CTimer;
  gameTimerLabel: GameTimerLabel;
  expBar: ExpBar;
  playerStatus: PlayerStatus;

  constructor(app: Application) {
    super(app);

    this.gameTimer = new CTimer(60 * 60 * 3);
    this.gameTimer.start();
    this.gameTimer.onFinish = () => {
      console.log("Game Over");
      this.restart();
    };

    this.player = new Player(app);
    this.player.container.x = app.screen.width / 2;
    this.player.container.y = app.screen.height / 2;
    this.player.spawn();

    initContainers(app);
    this.enemySpawner = new CEnemySpawner(app, createWeightedTable([{ item: EnemyTeki, weight: 1 }]));

    const widgetContainer = getWidgetContaienr(app);
    this.gameTimerLabel = new GameTimerLabel(app);
    this.gameTimerLabel.container.x = app.screen.width / 2 - this.gameTimerLabel.container.width / 2;
    this.gameTimerLabel.container.y = 0;
    this.gameTimerLabel.spawn(widgetContainer);

    const hudContainer = getHudContaienr(app);
    this.expBar = new ExpBar(app, this.player.expLevel);
    this.expBar.spawn(hudContainer);
    this.playerStatus = new PlayerStatus(app, this.player);
    this.playerStatus.spawn(hudContainer);
  }

  destroy() {
    super.destroy();
  }

  tick(time: Ticker) {
    if (!this.player.health.isAlive()) {
      console.log("Player is dead");
      this.restart();
      return;
    }

    const movement = getPlayerMovement(this.keyState);
    this.player.movement.accelerate(movement);
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
