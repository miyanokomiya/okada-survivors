import gsap from "gsap";
import { Application, Container, Ticker } from "pixi.js";

export class SceneBase {
  keyState: Record<string, boolean> = {};

  constructor(public app: Application) {
    app.ticker.add(this.onTick);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);

    // Resize the app on shcene changes.
    // Resizing it while the scene is running doesn't work well since each entity assumes fixed app size for layout.
    if (app.resizeTo) {
      if (app.resizeTo instanceof HTMLElement) {
        app.renderer.resize(app.resizeTo.clientWidth, app.resizeTo.clientHeight);
      } else {
        app.renderer.resize(app.resizeTo.innerWidth, app.resizeTo.innerHeight);
      }
    }
  }

  private onKeyDown = (e: KeyboardEvent) => {
    this.keyState[e.key] = true;
  };

  private onKeyUp = (e: KeyboardEvent) => {
    delete this.keyState[e.key];
  };

  destroy() {
    gsap.globalTimeline.clear();
    this.app.ticker.remove(this.onTick);
    this.app.stage.destroy({ children: true });
    this.app.stage = new Container();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  restart() {
    this.destroy();
    new (this.constructor as any)(this.app);
  }

  private onTick = (time: Ticker) => {
    this.tick(time);
  };

  tick(_time: Ticker) {}
}
