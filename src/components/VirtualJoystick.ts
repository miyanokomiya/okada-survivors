import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { addVec, getDistance, scaleVec, subVec, Vec2 } from "../utils/geo";

export class VirtualJoystick {
  private container: Container;
  private availableCircle: Graphics;
  private outerCircle: Graphics;
  private innerCircle: Graphics;
  private isDragging = false;
  private touchStartPos: Vec2 = { x: 0, y: 0 };
  private currentPos: Vec2 = { x: 0, y: 0 };
  private radius: number;

  constructor(radius: number, _appWidth: number, appHeight: number) {
    this.radius = radius;
    this.container = new Container();

    this.availableCircle = new Graphics().circle(0, 0, radius * 1.8).fill({
      color: 0x000000,
      alpha: 0,
    });

    this.outerCircle = new Graphics().circle(0, 0, radius).fill({
      color: 0x000000,
      alpha: 0.3,
    });

    this.innerCircle = new Graphics().circle(0, 0, radius / 2).fill({
      color: 0xffffff,
      alpha: 0.6,
    });

    this.container.addChild(this.availableCircle);
    this.container.addChild(this.outerCircle);
    this.container.addChild(this.innerCircle);

    this.container.x = radius + 40;
    this.container.y = appHeight - radius - 40;

    this.availableCircle.interactive = true;
    this.availableCircle.on("pointerdown", this.onPointerDown);
    this.availableCircle.on("pointermove", this.onPointerMove);
    this.availableCircle.on("pointerup", this.onPointerUp);
    this.availableCircle.on("pointerupoutside", this.onPointerUp);
  }

  private onPointerDown = (event: FederatedPointerEvent) => {
    this.isDragging = true;
    const { x, y } = event.global;
    this.touchStartPos = { x: this.container.x, y: this.container.y };
    this.currentPos = { x, y };
    this.updateInnerCircle();
  };

  private onPointerMove = (event: FederatedPointerEvent) => {
    if (!this.isDragging) return;

    const center = { x: this.container.x, y: this.container.y };
    let p = { x: event.global.x, y: event.global.y };
    const v = subVec(p, center);
    const d = getDistance(v);
    if (this.radius < d) {
      p = addVec(center, scaleVec(v, this.radius / d));
    }
    this.currentPos = p;
    this.updateInnerCircle();
  };

  private onPointerUp = () => {
    this.isDragging = false;
    this.currentPos = this.touchStartPos;
    this.updateInnerCircle();
  };

  private updateInnerCircle() {
    const dx = this.currentPos.x - this.touchStartPos.x;
    const dy = this.currentPos.y - this.touchStartPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = this.radius;

    let clampedX = dx;
    let clampedY = dy;

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      clampedX = Math.cos(angle) * maxDistance;
      clampedY = Math.sin(angle) * maxDistance;
    }

    this.innerCircle.x = clampedX;
    this.innerCircle.y = clampedY;
  }

  public getMovement(): Vec2 {
    const dx = this.innerCircle.x;
    const dy = this.innerCircle.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    if (magnitude === 0) return { x: 0, y: 0 };

    return { x: dx / this.radius, y: dy / this.radius };
  }

  public getContainer(): Container {
    return this.container;
  }
}
