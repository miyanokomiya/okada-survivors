import { Application, Ticker } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { Player } from "../entities/Player";
import { Enemy } from "../entities/enemies/Enemy";
import { EnemyTeki } from "../entities/enemies/EnemyTeki";
import { Vec2 } from "../utils/geo";

export class MainScene extends SceneBase {
  player: Player;
  enemies: Enemy[] = [];

  constructor(app: Application) {
    super(app);
    this.player = new Player(app);
    this.player.container.x = app.screen.width / 2;
    this.player.container.y = app.screen.height / 2;
    this.player.spawn();

    for (let i = 0; i < 3; i++) {
      const enemy = new EnemyTeki(app);
      enemy.container.x = app.screen.width * Math.random();
      enemy.container.y = app.screen.height * Math.random();
      enemy.spawn();
      this.enemies.push(enemy);
    }
  }

  destroy() {
    super.destroy();
  }

  tick(time: Ticker) {
    const movement = getPlayerMovement(this.keyState);
    this.player.movement.accelerate(movement);
    this.player.tick(time.deltaTime);

    this.enemies.forEach((enemy) => {
      enemy.moveTo(this.player.container.position);
      enemy.tick(time.deltaTime);

      if (enemy.hitbox.check(this.player.hitbox)) {
        this.player.health.takeDamage(1);
      }
    });
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
