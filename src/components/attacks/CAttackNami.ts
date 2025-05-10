import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContaienr } from "../../utils/containers";
import { ProjectileNami } from "../../entities/projectiles/ProjectileNami";
import { rotateVec, subVec } from "../../utils/geo";
import { applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";

export class CAttackNami extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "波";
    this.shootTimer.duration = applyExAttackCooldown(160);
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let count = 2;
    if (this.level <= 1) {
      count = 2;
    } else if (this.level <= 2) {
      count = 3;
    } else if (this.level <= 3) {
      count = 4;
    } else if (this.level <= 5) {
      count = 6;
    } else {
      count = 6 + Math.max(0, this.level - 6);
    }

    let dencity = 1;
    if (this.level === 3) {
      dencity = 2;
    } else if (this.level >= 5) {
      dencity = Infinity;
    }
    dencity = applyExMaxDencity(dencity);

    const v = subVec(closestEnemy.position, this.parent.position);
    const container = getProjectileContaienr(this.app);
    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileNami(this.app, this.parent);
      projectile.dencity = dencity;
      projectile.setDuration(projectile.lifetime.duration);
      projectile.setDelay(15 * i);
      projectile.shoot(rotateVec(v, -(Math.PI / 12) * i));
      projectile.spawn(container);
    }

    if (this.level >= 6) {
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileNami(this.app, this.parent);
        projectile.dencity = dencity;
        projectile.scaleY = -1;
        projectile.setDuration(projectile.lifetime.duration);
        projectile.setDelay(15 * i);
        projectile.shoot(rotateVec(v, (Math.PI / 12) * i));
        projectile.spawn(container);
      }
    }
  }
}
