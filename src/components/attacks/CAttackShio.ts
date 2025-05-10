import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContaienr } from "../../utils/containers";
import { applyExAttackDuration, applyExMaxDencity } from "../../utils/globalSettings";
import { ProjectileShio } from "../../entities/projectiles/ProjectileShio";

export class CAttackShio extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "潮";
    this.shootTimer.duration = 240;
  }

  shoot() {
    const count = 12 + Math.max(0, this.level - 2);

    let dencity = Infinity;
    dencity = applyExMaxDencity(dencity);

    const container = getProjectileContaienr(this.app);
    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileShio(this.app, this.parent);
      projectile.dencity = dencity;
      projectile.setDuration(applyExAttackDuration(projectile.lifetime.duration));
      projectile.shoot((2 * Math.PI * i) / count);
      projectile.spawn(container);
    }

    if (this.level >= 2) {
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileShio(this.app, this.parent);
        projectile.dencity = dencity;
        projectile.setDuration(applyExAttackDuration(projectile.lifetime.duration));
        projectile.shoot((2 * Math.PI * i) / count);
        projectile.setDelay(this.shootTimer.duration / 2);
        projectile.spawn(container);
      }
    }
  }
}
