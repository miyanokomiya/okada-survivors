import { Application, Container } from "pixi.js";
import { ProjectileTama } from "../../entities/projectiles/ProjectileTama";
import { CAttack } from "./CAttack";
import { subVec } from "../../utils/geo";
import { getProjectileContaienr } from "../../utils/containers";

export class CAttackTama extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 90;
  }

  shoot() {
    const closestEnemy = this.getClosestEnemy();
    if (!closestEnemy) return;

    const projectile = new ProjectileTama(this.app);
    const to = closestEnemy.position;
    projectile.shoot(this.parent.position, subVec(to, this.parent.position));
    projectile.spawn(getProjectileContaienr(this.app));
  }
}
