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

  check(other: CHitboxBase): boolean {
    for (const collision of this.collisions) {
      const selfX = collision.position.x + this.parent.x;
      const selfY = collision.position.y + this.parent.y;

      for (const otherCollision of other.collisions) {
        const otherX = otherCollision.position.x + other.parent.x;
        const otherY = otherCollision.position.y + other.parent.y;

        const dx = selfX - otherX;
        const dy = selfY - otherY;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = collision.radius + otherCollision.radius;
        if (distanceSquared < radiusSum * radiusSum) {
          return true;
        }
      }
    }
    return false;
  }
}

export class CHitbox extends CHitboxBase {}

export class CHurtbox extends CHitboxBase {}
