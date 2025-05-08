import { Application, Container } from "pixi.js";
import { CTimer } from "../CTimer";
import { getEnemyContaienr } from "../../utils/containers";
import { getDistanceSquared, pickMinItem } from "../../utils/geo";

export class CAttack {
  shootTimer = new CTimer(60);
  level = 1;
  name = "Attack";

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

  protected getClosestEnemy(): Container | undefined {
    const enemies = (getEnemyContaienr(this.app)?.children ?? []).map<[Container, number]>((child) => [
      child,
      getDistanceSquared(this.parent.position, child.position),
    ]);
    const closestEnemy = pickMinItem(enemies, (info) => info[1])?.[0];
    const threthold = getDistanceSquared({ x: this.app.screen.width / 2, y: this.app.screen.height / 2 });
    if (closestEnemy && closestEnemy[1] < threthold) {
      return closestEnemy[0];
    }
  }
}
