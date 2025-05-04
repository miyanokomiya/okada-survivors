import { Application, Container, Ticker } from "pixi.js";
import { nanoid } from "nanoid";

export class Entity {
  id: string = nanoid();
  container: Container = new Container();
  dispose = false;
  protected app: Application;

  constructor(app: Application) {
    this.app = app;
    bindEntity(this.container, this);
  }

  spawn(parent?: Container) {
    (parent ?? this.app.stage).addChild(this.container);
    this.app.ticker.add(this.onTick);
  }

  /**
   * Directly calling this method may mess up pixi rendering.
   * Set "dispose" to true for graceful destroy.
   */
  protected destroy() {
    this.app.ticker.remove(this.onTick);
    this.container.parent?.removeChild(this.container);
    if (this.container.destroyed) {
      this.container.destroy({ children: true });
    }
  }

  private onTick = (time: Ticker) => {
    if (this.container.destroyed) {
      // Make sure to call destroy when the container is already destroyed but it's still in the ticker.
      this.destroy();
      return;
    }

    this.tick(time.deltaTime);
    if (this.dispose) {
      this.destroy();
    }
  };

  tick(_deltaFrame: number) {}
}

const ENTITY_SYMBOL = Symbol("entity");
export function bindEntity(container: Container, entity: Entity) {
  (container as any)[ENTITY_SYMBOL] = entity;
}
export function getEntity<T extends Entity>(container: Container): T {
  return (container as any)[ENTITY_SYMBOL];
}
