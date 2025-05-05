import { Application, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";
import { CMovement } from "../../components/CMovement";
import { Vec2 } from "../../utils/geo";

export class ProjectileTama extends Projectile {
  movement: CMovement = new CMovement(400, 1);

  constructor(app: Application) {
    super(app);

    const graphics = new Graphics().circle(0, 0, 10).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 12;
    const text = new Text({
      text: "弾",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 10 }];
    this.damage = 2;
    this.dencity = 2;
  }

  shoot(from: Vec2, direction: Vec2) {
    this.container.position.x = from.x;
    this.container.position.y = from.y;
    this.movement.accelerate(direction);
  }

  tick(deltaFrame: number) {
    super.tick(deltaFrame);
    this.movement.move(this.container, deltaFrame);
  }
}
