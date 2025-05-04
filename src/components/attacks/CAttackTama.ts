import { Application, Container } from "pixi.js";
import { ProjectileTama } from "../../entities/projectiles/ProjectileTama";
import { CAttack } from "./CAttack";
import { getDistanceSquared, pickMinItem, subVec } from "../../utils/geo";
import { getEnemyContaienr, getProjectileContaienr } from "../../utils/containers";

export class CAttackTama extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 90;
  }

  shoot() {
    const enemies = (getEnemyContaienr(this.app)?.children ?? []).map<[Container, number]>((child) => [
      child,
      getDistanceSquared(this.parent.position, child.position),
    ]);
    const closestEnemy = pickMinItem(enemies, (info) => info[1])?.[0];
    const threthold = getDistanceSquared({ x: this.app.screen.width / 2, y: this.app.screen.height / 2 });
    if (closestEnemy && closestEnemy[1] < threthold) {
      const projectile = new ProjectileTama(this.app);
      const to = closestEnemy[0].position;
      projectile.shoot(this.parent.position, subVec(to, this.parent.position));
      projectile.spawn(getProjectileContaienr(this.app));
    }
  }
}
