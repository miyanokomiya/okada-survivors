import { Application } from "pixi.js";
import { Entity } from "../Entity";
import { CMovement } from "../../components/CMovement";
import { Vec2 } from "../../utils/geo";
import { CHealth } from "../../components/CHealth";
import { CHitbox, CHurtbox } from "../../components/CHitbox";

export class Enemy extends Entity {
  movement: CMovement = new CMovement(100, 1);
  health: CHealth = new CHealth(2);
  hitbox: CHitbox;
  hurtbox: CHurtbox;

  constructor(app: Application) {
    super(app);
    this.hitbox = new CHitbox(this.container);
    this.hurtbox = new CHurtbox(this.container);
  }

  tick(deltaFrame: number) {
    this.movement.move(this.container, deltaFrame);
    this.hitbox.tick(deltaFrame);
  }

  moveTo(p: Vec2) {
    const dx = p.x - this.container.x;
    const dy = p.y - this.container.y;
    this.movement.accelerate({ x: dx, y: dy });
  }
}
