import { Application, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";
import { CMovement } from "../../components/CMovement";
import { Vec2 } from "../../utils/geo";

export class ProjectileTsubu extends Projectile {
  movement: CMovement = new CMovement(300, 1);

  constructor(app: Application) {
    super(app);

    const radius = 9
    const fontSize = 8;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);

    const text = new Text({
      text: "粒",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
    });
    text.anchor.set(0.5);
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.damage = 1;
    this.dencity = 1;
    this.lifetime.duration = 60 * 3;
  }

  shoot(from: Vec2, direction: Vec2) {
    this.container.position.x = from.x;
    this.container.position.y = from.y;
    this.movement.accelerate(direction);
  }

  move(deltaFrame: number): void {
    this.movement.move(this.container, deltaFrame);
  }
}
