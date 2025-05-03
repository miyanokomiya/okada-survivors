export class CTimer {
  duration: number;
  currentTime: number;
  isRunning: boolean;
  loop: boolean = false;
  onFinish: () => void = () => {};

  constructor(duration: number) {
    this.duration = duration;
    this.currentTime = 0;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    this.currentTime = this.duration;
  }

  stop() {
    this.isRunning = false;
    this.currentTime = 0;
  }

  pause() {
    this.isRunning = false;
  }

  resume() {
    this.isRunning = true;
  }

  tick(deltaFrame: number) {
    if (this.isRunning) {
      this.currentTime -= deltaFrame;

      if (this.currentTime <= 0) {
        this.onFinish();
        if (this.loop) {
          this.currentTime = this.duration;
        } else {
          this.stop();
        }
      }
    }
  }
}
