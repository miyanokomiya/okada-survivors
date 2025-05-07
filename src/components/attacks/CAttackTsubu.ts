import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { rotateVec, subVec } from "../../utils/geo";
import { getProjectileContaienr } from "../../utils/containers";
import { ProjectileTsubu } from "../../entities/projectiles/ProjectileTsubu";
import { applyExAttackDuration, applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";

export class CAttackTsubu extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = applyExAttackCooldown(120);
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let count = 2;
    if (this.level <= 1) {
      count = 2;
    } else if (this.level <= 2) {
      count = 4;
    } else if (this.level <= 3) {
      count = 6;
    } else if (this.level <= 5) {
      count = 8;
    } else {
      count = 8 + 2 * Math.max(0, this.level - 6);
    }

    let dencity = 1;
    if (this.level === 3) {
      dencity = 2;
    } else if (this.level >= 5) {
      dencity = Infinity;
    }
    dencity = applyExMaxDencity(dencity);

    const container = getProjectileContaienr(this.app);
    const to = closestEnemy.position;
    const v = subVec(to, this.parent.position);

    const delay = 20 / count;

    for (let i = 0; i < count; i++) {
      const bullet = new ProjectileTsubu(this.app);
      bullet.dencity = dencity;
      bullet.setDuration(applyExAttackDuration(bullet.lifetime.duration));
      bullet.setDelay(delay * i);
      const range = Math.PI / 5;
      bullet.shoot(this.parent.position, rotateVec(v, range * 2 * (Math.random() - 0.5)));
      bullet.spawn(container);
    }

    if (this.level >= 6) {
      for (let i = 0; i < count; i++) {
        const bullet = new ProjectileTsubu(this.app);
        bullet.dencity = dencity;
        bullet.setDuration(applyExAttackDuration(bullet.lifetime.duration));
        bullet.setDelay(delay * i);
        const range = Math.PI / 5;
        bullet.shoot(this.parent.position, rotateVec(v, range * 2 * (Math.random() - 0.5)));
        bullet.spawn(container);
      }
    }
  }
}
