import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContainerBack } from "../../utils/containers";
import { ProjectileNen } from "../../entities/projectiles/ProjectileNen";

export class CAttackNen extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 60 * 6;
  }

  shoot() {
    const container = getProjectileContainerBack(this.app);
    for (let i = 0; i < this.level; i++) {
      const projectile = new ProjectileNen(this.app, this.parent);
      const r = 2 * Math.PI * Math.random();
      const radius = 50 * (1 + Math.random());
      projectile.shoot({
        x: this.parent.x + radius * Math.cos(r),
        y: this.parent.y + radius * Math.sin(r),
      });
      projectile.spawn(container);
    }
  }
}
