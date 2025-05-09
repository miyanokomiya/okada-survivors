import { Application } from "pixi.js";
import { Entity, getEntity } from "../Entity";
import { CHitbox } from "../../components/CHitbox";
import { CTimer } from "../../components/CTimer";
import { Enemy } from "../enemies/Enemy";
import { getEnemyContaienr, getPlayerContaienr } from "../../utils/containers";
import { playSound } from "../../utils/sounds";
import { Player } from "../Player";
import { CExpPick } from "../../components/CExpPick";

export class Projectile extends Entity {
  hitbox: CHitbox;
  lifetime = new CTimer(60 * 5);
  delay = new CTimer(0);
  dencity = 1; // Specifies how many times the projectile can hit enemies.
  damage = 1;
  ignoreWall = false;
  expPick: CExpPick | undefined;

  constructor(app: Application) {
    super(app);
    this.hitbox = new CHitbox(this.container);
    this.lifetime.onFinish = () => {
      this.dispose = true;
    };
    this.lifetime.start();

    const player = getEntity<Player>(getPlayerContaienr(this.app)!.children.find((child) => child.label === "player")!);
    if (player.gravityBullet) {
      this.expPick = new CExpPick(this.app, player.container, this.hitbox);
    }
  }

  setDelay(duration: number) {
    this.delay.duration = duration;
    this.delay.start();
  }

  setDuration(duration: number) {
    this.lifetime.duration = duration;
    this.lifetime.start();
  }

  move(_deltaFrame: number) {}

  tick(deltaFrame: number) {
    if (this.delay.isRunning) {
      this.delay.tick(deltaFrame);
      this.container.visible = false;
      return;
    }

    this.container.visible = true;
    this.move(deltaFrame);
    if (this.lifetime.isRunning) {
      this.lifetime.tick(deltaFrame);
    }
    this.hitbox.tick(deltaFrame);
    this.checkHitbox();
    this.expPick?.tick(deltaFrame);
  }

  checkHitbox() {
    const enemies = getEnemyContaienr(this.app)?.children ?? [];
    for (const enemyContainer of enemies) {
      const enemy = getEntity<Enemy>(enemyContainer);
      if (this.hitbox.check(getEntity<Enemy>(enemyContainer).hurtbox)) {
        enemy.health.takeDamage(this.damage);
        playSound("hit2");
        this.dencity--;
        this.onHitEnemy(enemy);
        if (this.dencity <= 0) {
          this.dispose = true;
          break;
        }
      }
    }
  }

  protected onHitEnemy(_enemy: Enemy) {
    // Override this method in subclasses to handle hit events
  }
}
