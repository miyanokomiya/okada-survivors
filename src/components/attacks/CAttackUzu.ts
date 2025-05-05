import { Application, Container } from "pixi.js";
import { CAttack } from "./CAttack";
import { getProjectileContaienr } from "../../utils/containers";
import { ProjectileUzu } from "../../entities/projectiles/ProjectileUzu";

export class CAttackUzu extends CAttack {
  constructor(app: Application, parent: Container) {
    super(app, parent);
    this.shootTimer.duration = 240;
  }

  shoot() {
    for (let i = 0; i < this.level; i++) {
      const projectile = new ProjectileUzu(this.app, this.parent);
      projectile.shoot((2 * Math.PI * i) / this.level);
      projectile.spawn(getProjectileContaienr(this.app));
    }
  }
}
