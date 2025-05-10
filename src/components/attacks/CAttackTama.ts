import { Application, Container } from "pixi.js";
import { ProjectileTama } from "../../entities/projectiles/ProjectileTama";
import { CAttack } from "./CAttack";
import { addVec, getRadian, rotateVec, subVec } from "../../utils/geo";
import { getProjectileContainerBack } from "../../utils/containers";
import { applyExAttackDuration, applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";

export class CAttackTama extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "弾";
    this.shootTimer.duration = applyExAttackCooldown(90);
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let count = 1;
    if (this.level <= 1) {
      count = 1;
    } else if (this.level <= 2) {
      count = 2;
    } else if (this.level <= 3) {
      count = 3;
    } else if (this.level <= 5) {
      count = 5;
    } else {
      count = 5 + Math.max(0, this.level - 6);
    }

    let dencity = 1;
    if (this.level === 3) {
      dencity = 2;
    } else if (this.level >= 5) {
      dencity = Infinity;
    }
    dencity = applyExMaxDencity(dencity);

    const v = subVec(closestEnemy.position, this.parent.position);
    const vr = getRadian(v);
    const positionRadius = count === 1 ? 0 : 14 / Math.sin(Math.PI / count);
    const container = getProjectileContainerBack(this.app);
    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileTama(this.app);
      projectile.dencity = dencity;
      projectile.setDuration(applyExAttackDuration(projectile.lifetime.duration));
      projectile.shoot(
        addVec(this.parent.position, rotateVec({ x: positionRadius, y: 0 }, vr + ((2 * Math.PI) / count) * i)),
        v,
      );
      projectile.spawn(container);
    }

    if (this.level >= 6) {
      const positionRadiusOuter = positionRadius + 14 * (count % 2 === 0 ? 2 : 1.5);
      const vrOuter = vr + Math.PI;
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileTama(this.app);
        projectile.dencity = dencity;
        projectile.setDuration(applyExAttackDuration(projectile.lifetime.duration));
        projectile.shoot(
          addVec(
            this.parent.position,
            rotateVec({ x: positionRadiusOuter, y: 0 }, vrOuter + ((2 * Math.PI) / count) * i),
          ),
          v,
        );
        projectile.spawn(container);
      }
    }
  }
}
