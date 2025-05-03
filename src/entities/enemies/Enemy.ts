import { Application } from "pixi.js";
import { Entity, getEntity } from "../Entity";
import { CMovement } from "../../components/CMovement";
import { Vec2 } from "../../utils/geo";
import { CHealth } from "../../components/CHealth";
import { CHitbox, CHurtbox } from "../../components/CHitbox";
import { CKnockback } from "../../components/CKnockback";
import { CKnockout } from "../../components/CKnockout";
import { Player } from "../Player";

export class Enemy extends Entity {
  movement: CMovement = new CMovement(100, 1);
  health: CHealth = new CHealth(2);
  hitbox: CHitbox;
  hurtbox: CHurtbox;
  knockback: CKnockback;
  knockout: CKnockout;
  player: Player;
  damage = 1;

  constructor(app: Application) {
    super(app);
    this.container.label = "enemy";
    this.hitbox = new CHitbox(this.container);
    this.hurtbox = new CHurtbox(this.container);
    this.knockback = new CKnockback(this.container, 10);
    this.knockout = new CKnockout(this.container);
    this.health.onDeath = () => {
      this.onDeath();
    };

    const playerContainer = this.app.stage.children.find((child) => child.label === "player")!;
    this.player = getEntity<Player>(playerContainer);
  }

  onDeath() {
    this.knockout.start();
    this.hitbox.disabled = true;
    this.hurtbox.disabled = true;
  }

  tick(deltaFrame: number) {
    this.moveTo(this.player.container.position);
    this.movement.move(this.container, deltaFrame);
    this.hitbox.tick(deltaFrame);
    this.knockback.tick(deltaFrame);
    this.knockout.tick(deltaFrame);
    this.attack();
  }

  attack() {
    if (this.hitbox.check(this.player.hurtbox)) {
      this.player.health.takeDamage(this.damage);
      this.player.knockback.hit();
    }
  }

  moveTo(p: Vec2) {
    const dx = p.x - this.container.x;
    const dy = p.y - this.container.y;
    this.movement.accelerate({ x: dx, y: dy });
  }
}
