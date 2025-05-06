import { Application, Container } from "pixi.js";
import { ProjectileTama } from "../../entities/projectiles/ProjectileTama";
import { CAttack } from "./CAttack";
import { subVec } from "../../utils/geo";
import { getProjectileContainerBack } from "../../utils/containers";

export class CAttackTama extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 90;
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    let scale = 1;
    let speed = 400;
    const base = 1.4;
    if (this.level <= 1) {
      scale = base;
    } else if (this.level <= 2) {
      scale = base ** 2;
    } else if (this.level <= 3) {
      scale = base ** 3;
    } else if (this.level <= 5) {
      scale = base ** 4;
    } else {
      scale = base ** 4 * 1.3 ** Math.max(0, this.level - 6);
    }

    if (this.level >= 6) {
      speed = speed / 3;
    }

    let dencity = 1;
    if (this.level < 4) {
      dencity = this.level;
    } else {
      dencity = Infinity;
    }

    const container = getProjectileContainerBack(this.app);
    const projectile = new ProjectileTama(this.app, scale);
    projectile.dencity = dencity;
    projectile.movement.maxSpeed = speed;
    const to = closestEnemy.position;
    const v = subVec(to, this.parent.position);
    projectile.shoot(this.parent.position, v);
    projectile.spawn(container);
  }
}
