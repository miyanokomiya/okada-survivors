import { Application } from "pixi.js";
import { Entity, getEntity } from "../Entity";
import { CHitbox } from "../../components/CHitbox";
import { CTimer } from "../../components/CTimer";
import { Enemy } from "../enemies/Enemy";
import { getEnemyContaienr } from "../../utils/containers";

export class Projectile extends Entity {
  hitbox: CHitbox;
  lifetime = new CTimer(60 * 5);
  dencity = 1; // Specifies how many times the projectile can hit enemies.
  damage = 1;

  constructor(app: Application) {
    super(app);
    this.hitbox = new CHitbox(this.container);
    this.lifetime.onFinish = () => {
      this.dispose = true;
    };
    this.lifetime.start();
  }

  move(_deltaFrame: number) {}

  tick(deltaFrame: number) {
    this.move(deltaFrame);
    if (this.lifetime.isRunning) {
      this.lifetime.tick(deltaFrame);
    }
    this.hitbox.tick(deltaFrame);
    this.checkHitbox();
  }

  checkHitbox() {
    const enemies = getEnemyContaienr(this.app)?.children ?? [];
    for (const enemyContainer of enemies) {
      const enemy = getEntity<Enemy>(enemyContainer);
      if (this.hitbox.check(getEntity<Enemy>(enemyContainer).hurtbox)) {
        enemy.health.takeDamage(this.damage);
        this.dencity--;
        if (this.dencity <= 0) {
          this.dispose = true;
          break;
        }
      }
    }
  }
}
