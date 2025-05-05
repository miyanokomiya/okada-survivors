import { getDistance, getUnitVec, lerpVec, scaleVec, Vec2 } from "../utils/geo";
import { Container } from "pixi.js";

export class CMovement {
  maxSpeed: number; // Pixels per second
  acceleration: number;
  velocity: Vec2 = { x: 0, y: 0 }; // Pixels per second
  disable = false;

  constructor(maxSpeed: number, acceleration: number) {
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
  }

  accelerate(direction: Vec2) {
    const v = direction.x === 0 && direction.y === 0 ? direction : getUnitVec(direction);
    const t = 1 - Math.exp(-this.acceleration);
    this.velocity = lerpVec(this.velocity, scaleVec(v, this.maxSpeed), t);
  }

  decelerate() {
    this.accelerate({ x: 0, y: 0 });

    // Set the velocity to zero if it is close to zero
    if (getDistance(this.velocity) < 0.1) {
      this.velocity = { x: 0, y: 0 };
    }
  }

  move(container: Container, deltaFrame: number) {
    if (this.disable) return;

    container.x += (this.velocity.x * deltaFrame) / 60;
    container.y += (this.velocity.y * deltaFrame) / 60;
  }
}
