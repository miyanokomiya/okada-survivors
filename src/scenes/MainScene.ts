import { Application, Ticker } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { Vec2 } from "../utils/geo";
import { initContainers } from "../utils/containers";
import { CEnemySpawner } from "../components/CEnemySpawner";
import { createWeightedTable } from "../utils/WeightedTable";

export class MainScene extends SceneBase {
  player: Player;
  enemySpawner: CEnemySpawner;

  constructor(app: Application) {
    super(app);

    this.player = new Player(app);
    this.player.container.x = app.screen.width / 2;
    this.player.container.y = app.screen.height / 2;
    this.player.spawn();

    initContainers(app);
    this.enemySpawner = new CEnemySpawner(app, createWeightedTable([{ item: EnemyTeki, weight: 1 }]));
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
    this.enemySpawner.tick(time.deltaTime);
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
