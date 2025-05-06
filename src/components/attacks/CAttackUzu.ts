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
    let count = 2;
    if (this.level <= 1) {
      count = 2;
    } else if (this.level <= 2) {
      count = 3;
    } else if (this.level <= 4) {
      count = 4;
    } else {
      count = 6 + Math.max(0, this.level - 6);
    }

    const dencity = this.level >= 5 ? Infinity : 1;

    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileUzu(this.app, this.parent);
      projectile.dencity = dencity;
      projectile.shoot((2 * Math.PI * i) / count);
      projectile.spawn(getProjectileContaienr(this.app));
    }

    if (this.level >= 6) {
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileUzu(this.app, this.parent);
        projectile.dencity = dencity;
        projectile.setDelay(45);
        projectile.shoot((2 * Math.PI * i) / count);
        projectile.spawn(getProjectileContaienr(this.app));
      }
    }
  }
}
