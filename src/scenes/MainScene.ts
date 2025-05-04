import { Application, Ticker } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { Vec2 } from "../utils/geo";
import { getEnemyContaienr, initContainers } from "../utils/containers";

export class MainScene extends SceneBase {
  player: Player;

  constructor(app: Application) {
    super(app);

    this.player = new Player(app);
    this.player.container.x = app.screen.width / 2;
    this.player.container.y = app.screen.height / 2;
    this.player.spawn();

    initContainers(app);

    const enemyContainer = getEnemyContaienr(app);
    for (let i = 0; i < 3; i++) {
      const enemy = new EnemyTeki(app);
      enemy.container.x = app.screen.width * Math.random();
      enemy.container.y = app.screen.height * Math.random();
      enemy.spawn(enemyContainer);
    }
  }

  destroy() {
    super.destroy();
  }

  tick(_time: Ticker) {
    const movement = getPlayerMovement(this.keyState);
    this.player.movement.accelerate(movement);

    if (!this.player.health.isAlive()) {
      console.log("Player is dead");
      this.restart();
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
