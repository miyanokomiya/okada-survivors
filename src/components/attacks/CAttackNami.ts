import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContaienr } from "../../utils/containers";
import { ProjectileNami } from "../../entities/projectiles/ProjectileNami";
import { subVec } from "../../utils/geo";

export class CAttackNami extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 180;
    this.level = 5;
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let count = 2;
    if (this.level <= 1) {
      count = 2;
    } else if (this.level <= 2) {
      count = 4;
    } else {
      count = 6;
    }

    const dencity = this.level >= 4 ? Infinity : 1;

    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileNami(this.app, this.parent);
      projectile.dencity = dencity;
      projectile.setDelay(15 * i);
      projectile.shoot(subVec(closestEnemy.position, this.parent.position));
      projectile.spawn(getProjectileContaienr(this.app));
    }

    if (this.level >= 5) {
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileNami(this.app, this.parent);
        projectile.dencity = dencity;
        projectile.scaleY = -1;
        projectile.setDelay(15 * i);
        projectile.shoot(subVec(closestEnemy.position, this.parent.position));
        projectile.spawn(getProjectileContaienr(this.app));
      }
    }
  }
}
