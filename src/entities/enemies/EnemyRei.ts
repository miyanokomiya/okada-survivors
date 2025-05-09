import { Application, Container, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";
import { applyExEnemyHealth } from "../../utils/globalSettings";
import { CHitbox } from "../../components/CHitbox";
import { CTimer } from "../../components/CTimer";
import { getDistanceSquared, getRadian } from "../../utils/geo";

export class EnemyRei extends Enemy {
  protected radius = 14;
  protected fontSize = 18;
  protected faceText = "霊";
  private movingState: 0 | 1 | 2 = 0; // 0: moving, 1: warpingIn, 2: warpingOut
  private movingTimer = new CTimer(60);
  private followRangeSquared = 300 ** 2;
  private warpOutBaseRange = 200;

  constructor(app: Application) {
    super(app);
    this.init();
  }

  protected init() {
    this.movement.maxSpeed = 50;
    this.movement.acceleration = 0.1;
    this.health.init(applyExEnemyHealth(5));

    const graphicContainer = new Container();
    this.container.addChild(graphicContainer);

    const radius = this.radius;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
    graphicContainer.addChild(graphics);

    const fontSize = this.fontSize;
    const text = new Text({
      text: this.faceText,
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    graphicContainer.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.pushoutHitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];

    this.warpIn();
  }

  getHitboxForObstacle(): CHitbox | undefined {
    return undefined;
  }

  private warpIn() {
    this.pauseMoving = true;
    this.pauseAttack = true;
    this.movement.friction = this.movement.maxSpeed;
    this.movingState = 1;
    this.movingTimer.duration = 60;
    this.movingTimer.start();
  }

  private warpOut() {
    this.pauseMoving = true;
    this.pauseAttack = true;
    this.movement.friction = 0;
    this.movingState = 2;
    this.movingTimer.duration = 75;
    this.movingTimer.start();

    const playerVelocity = this.player.movement.velocity;
    let angle: number;
    if (getDistanceSquared(playerVelocity) > 1) {
      const directionR = getRadian(this.player.movement.velocity);
      angle = directionR + ((Math.random() - 0.5) * 2 * Math.PI) / 4;
    } else {
      angle = Math.random() * Math.PI * 2;
    }
    const distance = Math.random() * 50 + this.warpOutBaseRange;
    const x = this.player.container.x + Math.cos(angle) * distance;
    const y = this.player.container.y + Math.sin(angle) * distance;
    this.container.position.set(x, y);
  }

  private startMove() {
    this.pauseMoving = false;
    this.pauseAttack = false;
    this.movingState = 0;
    this.movingTimer.duration = 60 * 5;
    this.movingTimer.start();
  }

  tick(deltaFrame: number): void {
    super.tick(deltaFrame);

    if (this.movingTimer.isRunning) {
      this.movingTimer.tick(deltaFrame);
      if (this.movingState === 0) {
        if (getDistanceSquared(this.container, this.player.container.position) > this.followRangeSquared) {
          this.warpIn();
        }
      } else if (this.movingState === 1) {
        this.container.alpha = 1 - this.movingTimer.getProgress();
      } else if (this.movingState === 2) {
        this.container.alpha = this.movingTimer.getProgress();
      }
    } else {
      if (this.movingState === 0) {
        this.warpIn();
      } else if (this.movingState === 1) {
        this.warpOut();
      } else if (this.movingState === 2) {
        this.startMove();
      }
    }
  }
}
