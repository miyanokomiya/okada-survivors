import { Application, Container, Graphics } from "pixi.js";
import { Entity, getEntity } from "./Entity";
import { CHitbox } from "../components/CHitbox";
import { gsap } from "gsap";
import { getDistanceSquared, getUnitVec, scaleVec, subVec } from "../utils/geo";
import { CMovement } from "../components/CMovement";
import { Player } from "./Player";
import { playSound } from "../utils/sounds";
import { applyExExp, getExDropLifetime } from "../utils/globalSettings";
import { CTimer } from "../components/CTimer";

export class ExpGem extends Entity {
  hitbox: CHitbox;
  movement: CMovement = new CMovement(300, 0.5);
  target: Container | undefined;
  attracting = false;
  lifetime: CTimer | undefined;

  constructor(app: Application) {
    super(app);

    this.container.label = "exp-gem";

    this.hitbox = new CHitbox(this.container);
    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: 6 }];

    const graphics = new Graphics().circle(0, 0, 6).fill(0x0000ff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);

    const dropLifetime = getExDropLifetime();
    if (dropLifetime > 0) {
      this.lifetime = new CTimer(dropLifetime);
      this.lifetime.start();
    }
  }

  attract(target: Container) {
    if (this.attracting) return;

    this.target = target;
    const v = scaleVec(getUnitVec(subVec(this.container.position, this.target)), 20);
    this.anims.push(
      gsap.to(this.container, {
        x: this.container.x + v.x,
        y: this.container.y + v.y,
        duration: 0.1,
        onComplete: () => {
          this.attracting = true;
        },
      }),
    );
  }

  pick() {
    this.dispose = true;
    if (!this.target) return;

    const player = getEntity<Player>(this.target);
    player.expLevel.addExp(applyExExp(1));
    playSound("pick1");
  }

  tick(deltaFrame: number): void {
    if (this.target && this.attracting) {
      this.container.alpha = 1;
      const v = {
        x: this.target.x - this.container.x,
        y: this.target.y - this.container.y,
      };
      if (getDistanceSquared(v) < 16) {
        this.pick();
        return;
      } else {
        this.movement.accelerate(v);
        this.movement.move(this.container, deltaFrame);
      }
    } else if (this.lifetime) {
      this.lifetime.tick(deltaFrame);
      if (this.lifetime.isRunning) {
        this.container.alpha = 1 - this.lifetime.getProgress();
      } else {
        this.dispose = true;
      }
    }
  }

  getHitboxForObstacle(): CHitbox | undefined {
    return this.hitbox;
  }
}
