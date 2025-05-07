import { getDistanceSquared, getUnitVec, lerpVec, scaleVec, Vec2 } from "../utils/geo";
import { Container } from "pixi.js";

const MIN_VELOCITY_THRESHOLD = 0.1 ** 2;

export class CMovement {
  maxSpeed: number; // Pixels per second
  acceleration: number;
  velocity: Vec2 = { x: 0, y: 0 }; // Pixels per second
  disable = false;
  scale = 1;
  friction = 0; // Pixels per second

  constructor(maxSpeed: number, acceleration: number) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
  }

  accelerate(direction: Vec2) {
    const v = direction.x === 0 && direction.y === 0 ? direction : getUnitVec(direction);
    const t = 1 - Math.exp(-this.acceleration);
    this.velocity = lerpVec(this.velocity, scaleVec(v, this.maxSpeed * this.scale), t);
  }

  decelerate() {
    this.accelerate({ x: 0, y: 0 });
  }

  clear() {
    this.velocity = { x: 0, y: 0 };
  }

  move(container: Container, deltaFrame: number) {
    if (this.disable) return;

    container.x += (this.velocity.x * deltaFrame) / 60;
    container.y += (this.velocity.y * deltaFrame) / 60;

    const velocitySquared = getDistanceSquared(this.velocity);
    if (velocitySquared < MIN_VELOCITY_THRESHOLD) {
      // Set the velocity to zero if it is close to zero
      this.velocity = { x: 0, y: 0 };
    } else {
      if (this.friction > 0) {
        // Apply friction
        const d = Math.sqrt(velocitySquared);
        const nextD = Math.max(0, d - (this.friction * deltaFrame) / 60);
        this.velocity = scaleVec(this.velocity, nextD / d);
      }
    }
  }
}
