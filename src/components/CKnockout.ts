import { Container } from "pixi.js";
import { CTimer } from "./CTimer";
import { getEntity } from "../entities/Entity";

export class CKnockout {
  knockoutTimer = new CTimer(0);

  constructor(public parent: Container) {
    this.knockoutTimer.onFinish = () => {
      getEntity(this.parent).dispose = true;
    };
  }

  start() {
    this.knockoutTimer.start();
  }

  tick(deltaFrame: number) {
    if (this.knockoutTimer.isRunning) {
      this.knockoutTimer.tick(deltaFrame);
    }
  }
}
