import { Container, Graphics } from "pixi.js";
import { Vec2 } from "../utils/geo";

export class Collision {
  constructor(
    public position: Vec2,
    public radius: number,
  ) {}
}

class CHitboxBase {
  collisions: Collision[] = [];

  constructor(public parent: Container) {}

  debugFill(container: Container, color: number) {
    const graphics = new Graphics().circle(0, 0, 18).fill({ color, alpha: 0.3 });
    container.addChild(graphics);
  }
}

export class CHitbox extends CHitboxBase {
  cooltimeMap: Map<CHurtbox, number> = new Map();
  cooltimeForSameTarget = 30;

  check(target: CHurtbox): boolean {
    if (this.cooltimeMap.has(target)) return false;

    for (const collision of this.collisions) {
      const selfX = collision.position.x + this.parent.x;
      const selfY = collision.position.y + this.parent.y;

      for (const targetCollision of target.collisions) {
        const targetX = targetCollision.position.x + target.parent.x;
        const targetY = targetCollision.position.y + target.parent.y;

        const dx = selfX - targetX;
        const dy = selfY - targetY;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = collision.radius + targetCollision.radius;
        if (distanceSquared < radiusSum * radiusSum) {
          this.cooltimeMap.set(target, this.cooltimeForSameTarget);
          return true;
        }
      }
    }
    return false;
  }

  tick(deltaFrame: number) {
    for (const [target, cooltime] of this.cooltimeMap.entries()) {
      const nextCooltime = cooltime - deltaFrame;
      if (nextCooltime <= 0) {
        this.cooltimeMap.delete(target);
      } else {
        this.cooltimeMap.set(target, nextCooltime);
      }
    }
  }
}

export class CHurtbox extends CHitboxBase {}
