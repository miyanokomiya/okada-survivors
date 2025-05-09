import { Application, Container, Graphics, Text } from "pixi.js";
import { Projectile } from "./Projectile";
import { getRadian, rotateVec, subVec, Vec2 } from "../../utils/geo";
import { Enemy } from "../enemies/Enemy";
import { getProjectileContaienr } from "../../utils/containers";

export class ProjectileNami extends Projectile {
  private radian = 0;
  private radius = 400;
  private height = 40;
  private count = 2;
  private origin: Vec2 = { x: 0, y: 0 };
  private bounceCount = 2 * 1;
  scaleY = 1;

  constructor(
    app: Application,
    public parent: Container,
  ) {
    super(app);

    const graphics = new Graphics().circle(0, 0, 10).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 12;
    const text = new Text({
      text: "波",
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
  }

  shoot(direction: Vec2) {
    this.radian = getRadian(direction);
    this.origin = { x: this.parent.x, y: this.parent.y };
    this.container.position.x = this.origin.x;
    this.container.position.y = this.origin.y;
  }

  tick(deltaFrame: number) {
    super.tick(deltaFrame);

    const rate = this.lifetime.getProgress();
    const v = { x: rate * this.radius, y: Math.sin(2 * Math.PI * rate * this.count) * this.height * this.scaleY };
    const rotated = rotateVec(v, this.radian);
    this.container.position.x = this.origin.x + rotated.x;
    this.container.position.y = this.origin.y + rotated.y;
  }

  protected onHitEnemy(enemy: Enemy) {
    if (this.bounceCount <= 1) return;

    this.bounceCount = Math.round(this.bounceCount / 2);
    const child = new ProjectileNami(this.app, this.container);

    if (this.dencity % 2 === 0) {
      this.dencity = this.dencity / 2;
      child.dencity = Math.max(1, this.dencity);
    } else {
      this.dencity = (this.dencity + 1) / 2
      child.dencity = Math.max(1, this.dencity - 1);
    }

    child.scaleY = this.scaleY;
    child.bounceCount = this.bounceCount;
    child.setDuration(this.lifetime.duration);
    child.hitbox.cooltimeMap.set(enemy.hurtbox, child.hitbox.cooltimeForSameTarget);
    child.shoot(subVec(this.container.position, enemy.container.position));

    const container = getProjectileContaienr(this.app);
    child.spawn(container);
  }
}
