import { Application, Container, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";

export class ProjectileUzu extends Projectile {
  private radian = 0;
  private radius = 200;
  private count = 2;

  constructor(
    app: Application,
    public parent: Container,
  ) {
    super(app);

    const graphics = new Graphics().circle(0, 0, 10).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 12;
    const text = new Text({
      text: "渦",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 10 }];
    this.lifetime.duration = 60 * 3;
    this.lifetime.start();
    this.dencity = Infinity;
  }

  shoot(radian: number) {
    this.radian = radian;
    this.container.position.x = this.parent.x;
    this.container.position.y = this.parent.y;
  }

  tick(deltaFrame: number) {
    super.tick(deltaFrame);

    const rate = this.lifetime.getProgress();
    const r = this.radian + 2 * Math.PI * rate * this.count;
    this.container.position.x = this.parent.x + this.radius * rate * Math.cos(r);
    this.container.position.y = this.parent.y + this.radius * rate * Math.sin(r);
  }
}
