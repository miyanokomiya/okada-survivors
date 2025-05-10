import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { rotateVec, subVec } from "../../utils/geo";
import { getProjectileContaienr } from "../../utils/containers";
import { ProjectileTsubu } from "../../entities/projectiles/ProjectileTsubu";
import { applyExAttackDuration, applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";

export class CAttackTsubu extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "粒";
    this.shootTimer.duration = applyExAttackCooldown(130);
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let count = 4;
    if (this.level <= 1) {
      count = 4;
    } else if (this.level <= 2) {
      count = 6;
    } else if (this.level <= 3) {
      count = 8;
    } else if (this.level <= 5) {
      count = 12;
    } else {
      count = 12 + 2 * Math.max(0, this.level - 6);
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

    const unitR = Math.PI / 20;
    const delay = 20 / count;

    for (let i = 0; i < count; i++) {
      const bullet = new ProjectileTsubu(this.app);
      bullet.dencity = dencity;
      bullet.setDuration(applyExAttackDuration(bullet.lifetime.duration));
      bullet.setDelay(delay * i);
      bullet.shoot(this.parent.position, rotateVec(v, (-unitR * count) / 2 + unitR * i));
      bullet.spawn(container);
    }
    if (this.level >= 6) {
      for (let i = 0; i < count; i++) {
        const bullet = new ProjectileTsubu(this.app);
        bullet.dencity = dencity;
        bullet.setDuration(applyExAttackDuration(bullet.lifetime.duration));
        bullet.setDelay(delay * i);
        bullet.shoot(this.parent.position, rotateVec(v, (unitR * count) / 2 - unitR * i));
        bullet.spawn(container);
      }
    }
  }
}
