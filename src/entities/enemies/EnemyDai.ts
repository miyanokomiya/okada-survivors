import { Application } from "pixi.js";
import { EnemyTeki } from "./EnemyTeki";
import { applyExEnemyHealth } from "../../utils/globalSettings";

export class EnemyDai extends EnemyTeki {
  constructor(app: Application) {
    super(app);
  }

  protected init() {
    this.radius = 24;
    this.fontSize = 28;
    this.faceText = "大";

    super.init();

    this.movement.maxSpeed = 50;
    this.movement.acceleration = 0.1;
    this.health.init(applyExEnemyHealth(6));
  }
}
