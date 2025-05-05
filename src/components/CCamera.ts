import { Application, Container } from "pixi.js";
import { getCameraContainer } from "../utils/containers";
import { CMovement } from "./CMovement";
import { getDistance, subVec, Vec2 } from "../utils/geo";

export class CCamera {
  cameraContainer: Container;
  private target: Container | undefined;
  private movement = new CMovement(100, 1);

  constructor(public app: Application) {
    this.app = app;
    this.cameraContainer = getCameraContainer(this.app)!;
  }

  setTarget(target: Container) {
    this.target = target;
    const p = this.getTargetPosition();
    this.cameraContainer.position.x = p.x;
    this.cameraContainer.position.y = p.y;
  }

  private getTargetPosition(): Vec2 {
    if (!this.target) return this.cameraContainer.position;
    return subVec({ x: this.app.screen.width / 2, y: this.app.screen.height / 2 }, this.target.position);
  }

  tick(deltaFrame: number) {
    if (!this.target) return;

    const p = this.getTargetPosition();
    const v = subVec(p, this.cameraContainer.position);
    const distance = getDistance(v);
    if (distance < 1) {
      this.cameraContainer.position.x = p.x;
      this.cameraContainer.position.y = p.y;
      this.movement.clear();
    } else {
      this.movement.maxSpeed = distance * 10;
      this.movement.accelerate(v);
      this.movement.move(this.cameraContainer, deltaFrame);
    }
  }
}
