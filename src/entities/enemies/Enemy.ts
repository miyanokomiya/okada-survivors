import { Application, Container } from "pixi.js";
import { Entity, getEntity } from "../Entity";
import { CMovement } from "../../components/CMovement";
import { Vec2 } from "../../utils/geo";
import { CHealth } from "../../components/CHealth";
import { CHitbox, CHurtbox } from "../../components/CHitbox";
import { CKnockback } from "../../components/CKnockback";
import { CKnockout } from "../../components/CKnockout";
import { Player } from "../Player";
import { Healthbar } from "../widgets/Healthbar";
import { DamageLabel } from "../widgets/DamageLabel";
import { getEnemyContaienr, getPlayerContaienr, getWidgetContaienr } from "../../utils/containers";
import { CExpDrop } from "../../components/CExpDrop";
import { playSound } from "../../utils/sounds";
import {
  getExEnemyLimitBreak,
  applyExDamage,
  applyExKnockback,
  applyExEnemyAttackCooltime,
  isExEnemyNonoverlap,
} from "../../utils/globalSettings";

export class Enemy extends Entity {
  movement: CMovement = new CMovement(100, 1);
  health: CHealth = new CHealth(2);
  hitbox: CHitbox;
  hurtbox: CHurtbox;
  pushoutHitbox: CHitbox;
  knockback: CKnockback;
  knockout: CKnockout;
  player: Player;
  damage = 2;
  healthbar: Healthbar;
  expDrop: CExpDrop = new CExpDrop(this.app, 0.7);
  lifetime = 0;
  pauseMoving = false;
  private nonOverlap = isExEnemyNonoverlap();

  constructor(app: Application) {
    super(app);
    this.container.label = "enemy";
    this.hitbox = new CHitbox(this.container);
    this.hitbox.cooltimeForSameTarget = applyExEnemyAttackCooltime(30);
    this.hurtbox = new CHurtbox(this.container);
    this.pushoutHitbox = new CHitbox(this.container);
    this.pushoutHitbox.cooltimeForSameTarget = 1;
    this.knockback = new CKnockback(this.container, applyExKnockback(10));
    this.knockout = new CKnockout(this.container);
    this.health.eventDamage.add((damage) => {
      this.onDamage(damage);
    });
    this.health.eventDeath.add(() => {
      this.onDeath();
    });
    this.healthbar = new Healthbar(app);

    const playerContainer = getPlayerContaienr(this.app)!.children.find((child) => child.label === "player")!;
    this.player = getEntity<Player>(playerContainer);
  }

  spawn(parent?: Container): void {
    super.spawn(parent);
    this.healthbar.spawn(this.container);
  }

  onDamage(damage: number) {
    this.knockback.hit();
    const label = new DamageLabel(this.app, damage);
    label.spawnAt(getWidgetContaienr(this.app), this.container, true);
  }

  onDeath() {
    this.knockout.start();
    this.expDrop.tryDrop(this.container.position);
    this.hitbox.disabled = true;
    this.hurtbox.disabled = true;
    if (this.pushoutHitbox) this.pushoutHitbox.disabled = true;
  }

  tick(deltaFrame: number) {
    this.moveTo(this.player.container.position);
    if (!this.knockback.isHitstop()) {
      this.movement.move(this.container, deltaFrame);
    }
    this.hitbox.tick(deltaFrame);
    this.pushoutHitbox?.tick(deltaFrame);
    this.knockback.tick(deltaFrame);
    this.knockout.tick(deltaFrame);
    this.attack();
    this.healthbar.update(this.health.currentHealth, this.health.maxHealth);
    this.lifetime += deltaFrame;
    this.movement.scale = getExEnemyLimitBreak(this.lifetime);

    if (this.nonOverlap && this.shouldCollideObstacle()) {
      const enemies = (getEnemyContaienr(this.app)?.children ?? []).map((child) => getEntity<Enemy>(child));
      enemies.forEach((enemy) => {
        if (enemy === this) return;
        this.pushOut(enemy);
      });
    }
  }

  getHitboxForObstacle(): CHitbox | undefined {
    return this.pushoutHitbox;
  }

  shouldCollideObstacle(): boolean {
    if (!this.getHitboxForObstacle()) return false;

    const radius = this.pushoutHitbox.collisions[0].radius * 2;
    const size = radius * 2;
    return this.isInCamera({
      x: this.container.x - radius,
      y: this.container.y - radius,
      width: size,
      height: size,
    });
  }

  attack() {
    if (this.hitbox.check(this.player.hurtbox)) {
      this.player.health.takeDamage(applyExDamage(this.damage));
      this.player.knockback.hit();
      playSound("hit1");
    }
  }

  moveTo(p: Vec2) {
    if (this.pauseMoving) return;

    const dx = p.x - this.container.x;
    const dy = p.y - this.container.y;
    this.movement.accelerate({ x: dx, y: dy });
  }

  pushOut(entity: Enemy) {
    const hitbox = entity.getHitboxForObstacle();
    const myHitbox = this.getHitboxForObstacle();
    if (!hitbox || !myHitbox || !myHitbox.shouldCheck(hitbox) || !entity.shouldCollideObstacle()) return;

    if (myHitbox.check(hitbox)) {
      const dx = this.container.x - entity.container.x;
      const dy = this.container.y - entity.container.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const combinedRadius = myHitbox.collisions[0].radius + hitbox.collisions[0].radius;

      // Push out each other but not fully
      const v = (combinedRadius - distance) / 2 / 2;
      const pushX = (dx / distance) * v;
      const pushY = (dy / distance) * v;
      this.container.x += pushX;
      this.container.y += pushY;
      entity.container.x -= pushX;
      entity.container.y -= pushY;
    }
  }
}
