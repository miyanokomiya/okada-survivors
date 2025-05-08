import { Application, Container, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";
import { lerpValue, Vec2 } from "../../utils/geo";

export class ProjectileNen extends Projectile {
  private circleGraphics: Graphics;
  private maxRadius = 50;
  private minRadius = 10;
  ignoreWall = true;

  constructor(
    app: Application,
    public parent: Container,
  ) {
    super(app);

    const graphics = new Graphics();
    this.container.addChild(graphics);
    this.circleGraphics = graphics;
    const fontSize = 16;
    const text = new Text({
      text: "燃",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    this.container.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 10 }];
    this.lifetime.duration = 60 * 5;
    this.lifetime.start();
    this.dencity = Infinity;
  }

  shoot(p: Vec2) {
    this.container.position.x = p.x;
    this.container.position.y = p.y;
  }

  tick(deltaFrame: number) {
    super.tick(deltaFrame);

    const rate = this.lifetime.getProgress();
    const radius = lerpValue(this.minRadius, this.maxRadius, rate);
    this.circleGraphics
      .clear()
      .circle(0, 0, radius)
      .fill({ color: 0xee0000, alpha: 0.8 })
      .stroke({ color: 0x000000, width: 2 });
    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
  }
}
