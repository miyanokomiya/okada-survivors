import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { addVec, getUnitVec, rotateVec, scaleVec, subVec } from "../../utils/geo";
import { getProjectileContaienr } from "../../utils/containers";
import { applyExAttackCooldown, applyExMaxDencity } from "../../utils/globalSettings";
import { ProjectileMaku } from "../../entities/projectiles/ProjectileMaku";

export class CAttackMaku extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.name = "幕";
    this.shootTimer.duration = applyExAttackCooldown(130);
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    const count = 13 + 2 * Math.max(0, this.level - 2);

    let dencity = Infinity;
    dencity = applyExMaxDencity(dencity);

    const container = getProjectileContaienr(this.app);
    const to = closestEnemy.position;
    const v = getUnitVec(subVec(to, this.parent.position));

    const radius = 10;
    const positionRadius = radius / Math.sin(Math.PI / (count * 1.6));
    const unitR = Math.PI / count;
    const drawback = scaleVec(v, -radius);
    const origin = addVec(this.parent.position, drawback);

    for (let i = 0; i < count; i++) {
      const bullet = new ProjectileMaku(this.app);
      bullet.dencity = dencity;
      bullet.setDuration(bullet.lifetime.duration);
      const positionV = rotateVec(scaleVec(v, positionRadius), unitR * (i - Math.floor(count / 2)));
      bullet.shoot(origin, positionV, v);
      bullet.spawn(container);
    }

    if (this.level >= 2) {
      for (let i = 0; i < count; i++) {
        const bullet = new ProjectileMaku(this.app);
        bullet.dencity = dencity;
        bullet.setDuration(bullet.lifetime.duration);
        const positionV = rotateVec(scaleVec(v, positionRadius + radius * 2), unitR * (i - Math.floor(count / 2)));
        bullet.shoot(origin, positionV, v);
        bullet.spawn(container);
      }
    }
  }
}
