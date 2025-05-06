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
    } else if (this.level <= 3) {
      count = 4;
    } else if (this.level <= 5) {
      count = 6;
    } else {
      count = 6 + Math.max(0, this.level - 6);
    }

    let dencity = 1;
    if (this.level === 3) {
      dencity = 2;
    } else if (this.level >= 4) {
      dencity = Infinity;
    }

    const container = getProjectileContaienr(this.app);
    for (let i = 0; i < count; i++) {
      const projectile = new ProjectileUzu(this.app, this.parent);
      projectile.dencity = dencity;
      projectile.shoot((2 * Math.PI * i) / count);
      projectile.spawn(container);
    }

    if (this.level >= 6) {
      for (let i = 0; i < count; i++) {
        const projectile = new ProjectileUzu(this.app, this.parent);
        projectile.dencity = dencity;
        projectile.setDelay(45);
        projectile.shoot((2 * Math.PI * i) / count);
        projectile.spawn(container);
      }
    }
  }
}
