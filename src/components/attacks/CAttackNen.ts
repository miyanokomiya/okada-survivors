import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContainerBack } from "../../utils/containers";
import { ProjectileNen } from "../../entities/projectiles/ProjectileNen";
import { applyExAttackDuration, applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";

export class CAttackNen extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "熱";
    this.shootTimer.duration = applyExAttackCooldown(60 * 6);
  }

  shoot() {
    const container = getProjectileContainerBack(this.app);
    for (let i = 0; i < this.level; i++) {
      const projectile = new ProjectileNen(this.app, this.parent);
      projectile.dencity = applyExMaxDencity(projectile.dencity);
      projectile.setDuration(applyExAttackDuration(projectile.lifetime.duration));
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
