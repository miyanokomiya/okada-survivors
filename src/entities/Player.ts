import { Application, Graphics } from "pixi.js";
import { Entity } from "./Entity";
import { CMovement } from "../components/CMovement.ts";

export class Player extends Entity {
  cmovement: CMovement = new CMovement(100, 1);

  constructor(app: Application) {
    super(app);

    const graphics = new Graphics().circle(10, 0, 20).fill(0xff0000);
    this.container.addChild(graphics);
  }

  tick(deltaFrame: number) {
    this.cmovement.move(this.container, deltaFrame);
  }
}
