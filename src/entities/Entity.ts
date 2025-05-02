import { Application, Container } from "pixi.js";
import { nanoid } from "nanoid";

export class Entity {
  id: string = nanoid();
  container: Container = new Container();
  protected app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  spawn() {
    this.app.stage.addChild(this.container);
  }

  destroy() {
    this.app.stage.removeChild(this.container);
    this.container.destroy();
  }

  tick(_deltaFrame: number) {}
}
