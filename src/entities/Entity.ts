import { Application, Container, Ticker } from "pixi.js";
import { nanoid } from "nanoid";
import { isPausedLayerMain, LAYER_MAIN } from "../utils/tickLayers";
import { CHitbox } from "../components/CHitbox";
import { getCameraContainer } from "../utils/containers";

export class Entity {
  id: string = nanoid();
  container: Container = new Container();
  dispose = false;
  protected app: Application;
  tickLayer = LAYER_MAIN;
  protected anims: GSAPTween[] = [];

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
    this.anims.forEach((anim) => {
      anim.kill();
    });
    this.app.ticker.remove(this.onTick);
    this.container.parent?.removeChild(this.container);
    if (this.container.destroyed) {
      this.container.destroy({ children: true });
    }
  }

  private onTick = (time: Ticker) => {
    if (this.tickLayer === LAYER_MAIN && isPausedLayerMain(this.app)) {
      this.anims.forEach((anim) => {
        if (!anim.paused()) {
          anim.pause();
          anim.data ??= {};
          anim.data.entityPaused = true;
        }
      });
      return;
    }

    if (this.container.destroyed) {
      // Make sure to call destroy when the container is already destroyed but it's still in the ticker.
      this.destroy();
      return;
    }

    this.anims.forEach((anim) => {
      if (anim.paused() && anim.data?.entityPaused) {
        anim.resume();
      }
    });
    this.tick(time.deltaTime);
    if (this.dispose) {
      this.destroy();
    }
  };

  tick(_deltaFrame: number) {}

  getHitboxForObstacle(): CHitbox | undefined {
    return;
  }

  isInCamera(bounds: { x: number; y: number; width: number; height: number }): boolean {
    const cameraContainer = getCameraContainer(this.app);
    if (!cameraContainer) return false;

    const cameraBounds = {
      x: -cameraContainer.x,
      y: -cameraContainer.y,
      width: this.app.screen.width,
      height: this.app.screen.height,
    };

    return !(
      bounds.x + bounds.width < cameraBounds.x ||
      bounds.x > cameraBounds.x + cameraBounds.width ||
      bounds.y + bounds.height < cameraBounds.y ||
      bounds.y > cameraBounds.y + cameraBounds.height
    );
  }
}

const ENTITY_SYMBOL = Symbol("entity");
export function bindEntity(container: Container, entity: Entity) {
  (container as any)[ENTITY_SYMBOL] = entity;
}
export function getEntity<T extends Entity>(container: Container): T {
  return (container as any)[ENTITY_SYMBOL];
}
