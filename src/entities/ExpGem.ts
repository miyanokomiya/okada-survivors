import { Application, Container, Graphics } from "pixi.js";
import { Entity, getEntity } from "./Entity";
import { CHurtbox } from "../components/CHitbox";
import { gsap } from "gsap";
import { getDistanceSquared, getUnitVec, scaleVec, subVec } from "../utils/geo";
import { CMovement } from "../components/CMovement";
import { Player } from "./Player";
import { playSound } from "../utils/sounds";
import { applyExExp } from "../utils/globalSettings";

export class ExpGem extends Entity {
  hurtbox: CHurtbox;
  movement: CMovement = new CMovement(300, 0.5);
  target: Container | undefined;
  attracting = false;

  constructor(app: Application) {
    super(app);

    this.container.label = "exp-gem";

    this.hurtbox = new CHurtbox(this.container);
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius: 6 }];

    const graphics = new Graphics().circle(0, 0, 6).fill(0x0000ff).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(graphics);
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
    if (!this.target || !this.attracting) return;

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
  }
}
