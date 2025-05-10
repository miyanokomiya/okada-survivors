import { Application, Container, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";
import { easeOutQuad, lerpValue } from "../../utils/geo";

export class ProjectileShio extends Projectile {
  private radian = 0;
  private radius = 150;

  constructor(
    app: Application,
    public parent: Container,
  ) {
    super(app);

    const graphics = new Graphics().circle(0, 0, 10).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 12;
    const text = new Text({
      text: "潮",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 10 }];
    this.lifetime.duration = 60 * 3;
    this.lifetime.start();
    this.damage = 2;
    this.dencity = 1;
    this.ignoreWall = true;
  }

  shoot(radian: number) {
    this.radian = radian;
    this.container.position.x = this.parent.x;
    this.container.position.y = this.parent.y;
  }

  tick(deltaFrame: number) {
    super.tick(deltaFrame);

    const rate = this.lifetime.getProgress();
    const t = rate <= 0.5 ? easeOutQuad(rate * 2) : easeOutQuad(2 - rate * 2);
    const radius = lerpValue(0, this.radius, t);
    const r = this.radian + lerpValue(0, 2 * Math.PI, t);
    this.container.position.x = this.parent.x + radius * Math.cos(r);
    this.container.position.y = this.parent.y + radius * Math.sin(r);
  }
}
