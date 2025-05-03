import { Application, Graphics, Text } from "pixi.js";
import { Entity } from "./Entity";
import { CMovement } from "../components/CMovement.ts";
import { CHitbox, CHurtbox } from "../components/CHitbox.ts";
import { CHealth } from "../components/CHealth.ts";
import { CKnockback } from "../components/CKnockback.ts";
import { CAttack } from "../components/attacks/CAttack.ts";
import { CAttackTama } from "../components/attacks/CAttackTama.ts";

export class Player extends Entity {
  movement: CMovement = new CMovement(100, 1);
  health: CHealth = new CHealth(100);
  hitbox: CHitbox;
  hurtbox: CHurtbox;
  knockback: CKnockback;
  attacks: CAttack[] = [];

  constructor(app: Application) {
    super(app);

    this.container.label = "player";
    const graphics = new Graphics().circle(0, 0, 18).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
    const fontSize = 24;
    const text = new Text({
      text: "岡",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2;
    this.container.addChild(text);

    this.hitbox = new CHitbox(this.container);
    this.hurtbox = new CHurtbox(this.container);
    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 9 }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius: 9 }];
    // this.hitbox.debugFill(this.container, 0xff0000);
    // this.hurtbox.debugFill(this.container, 0x0000ff);

    this.knockback = new CKnockback(this.container);
    this.attacks.push(new CAttackTama(this.app, this.container));
    this.health.onDeath = () => {
      this.onDeath();
    };
  }

  onDeath() {
    this.hitbox.disabled = true;
    this.hurtbox.disabled = true;
  }

  tick(deltaFrame: number) {
    this.movement.move(this.container, deltaFrame);
    this.hitbox.tick(deltaFrame);
    this.knockback.tick(deltaFrame);
    this.attacks.forEach((attack) => attack.tick(deltaFrame));
  }
}
