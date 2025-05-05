import { Application, Container } from "pixi.js";
import { CTimer } from "../CTimer";

export class CAttack {
  shootTimer = new CTimer(60);
  level = 1;

  constructor(
    public app: Application,
    public parent: Container,
  ) {
    this.shootTimer.loop = true;
    this.shootTimer.onFinish = () => {
      this.shoot();
    };
    this.start();
  }

  start() {
    this.shootTimer.start();
  }

  stop() {
    this.shootTimer.stop();
  }

  tick(deltaFrame: number) {
    if (this.shootTimer.isRunning) {
      this.shootTimer.tick(deltaFrame);
    }
  }

  shoot() {}
}
