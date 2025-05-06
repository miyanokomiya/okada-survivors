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
import { getPlayerContaienr, getWidgetContaienr } from "../../utils/containers";
import { CExpDrop } from "../../components/CExpDrop";
import { playSound } from "../../utils/sounds";
import { getExEnemyLimitBreak, applyExDamage, applyExKnockback } from "../../utils/globalSettings";

export class Enemy extends Entity {
  movement: CMovement = new CMovement(100, 1);
  health: CHealth = new CHealth(2);
  hitbox: CHitbox;
  hurtbox: CHurtbox;
  knockback: CKnockback;
  knockout: CKnockout;
  player: Player;
  damage = 2;
  healthbar: Healthbar;
  expDrop: CExpDrop = new CExpDrop(this.app, 0.7);
  lifetime = 0;

  constructor(app: Application) {
    super(app);
    this.container.label = "enemy";
    this.hitbox = new CHitbox(this.container);
    this.hurtbox = new CHurtbox(this.container);
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
  }

  tick(deltaFrame: number) {
    this.moveTo(this.player.container.position);
    if (!this.knockback.isHitstop()) {
      this.movement.move(this.container, deltaFrame);
    }
    this.hitbox.tick(deltaFrame);
    this.knockback.tick(deltaFrame);
    this.knockout.tick(deltaFrame);
    this.attack();
    this.healthbar.update(this.health.currentHealth, this.health.maxHealth);
    this.lifetime += deltaFrame;
    this.movement.scale = getExEnemyLimitBreak(this.lifetime);
  }

  attack() {
    if (this.hitbox.check(this.player.hurtbox)) {
      this.player.health.takeDamage(applyExDamage(this.damage));
      this.player.knockback.hit();
      playSound("hit1");
    }
  }

  moveTo(p: Vec2) {
    const dx = p.x - this.container.x;
    const dy = p.y - this.container.y;
    this.movement.accelerate({ x: dx, y: dy });
  }
}
