import { Application, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";
import { applyExEnemyHealth } from "../../utils/globalSettings";

export class EnemyMushi extends Enemy {
  constructor(app: Application) {
    super(app);

    this.movement.maxSpeed = 100;
    this.movement.acceleration = 0.01;
    this.health.init(applyExEnemyHealth(2));

    const radius = 10;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = radius + 2;
    const text = new Text({
      text: "虫",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: radius }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius: radius }];
  }
}
