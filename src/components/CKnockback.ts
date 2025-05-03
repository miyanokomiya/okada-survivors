import { ColorOverlayFilter } from "pixi-filters";
import { Container } from "pixi.js";
import { CTimer } from "./CTimer";

export class CKnockback {
  timer: CTimer;
  filter = new ColorOverlayFilter({ color: 0xffffff });

  constructor(
    public parent: Container,
    duration = 30,
  ) {
    this.timer = new CTimer(duration);
    this.timer.onFinish = () => {
      this.clear();
    };
  }

  hit() {
    this.filter.alpha = 1;
    this.parent.filters = [this.filter];
    this.timer.start();
  }

  clear() {
    if (Array.isArray(this.parent.filters)) {
      this.parent.filters = this.parent.filters.filter((f) => f !== this.filter);
    } else if (this.parent.filters === this.filter) {
      this.parent.filters = [];
    }
    this.timer.stop();
  }

  tick(deltaFrame: number) {
    if (this.timer.isRunning) {
      this.timer.tick(deltaFrame);
      this.filter.alpha = this.timer.currentTime / this.timer.duration;
    }
  }
}
