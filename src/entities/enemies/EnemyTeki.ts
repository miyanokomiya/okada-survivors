import { Application, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";

export class EnemyTeki extends Enemy {
  constructor(app: Application) {
    super(app);

    this.movement.maxSpeed = 50;
    this.movement.acceleration = 0.1;
    this.health.init(3);

    const graphics = new Graphics().circle(0, 0, 16).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 20;
    const text = new Text({
      text: "敵",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 16 }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius: 16 }];
    // this.hitbox.debugFill(this.container, 0xff0000);
    // this.hurtbox.debugFill(this.container, 0x0000ff);
  }
}
