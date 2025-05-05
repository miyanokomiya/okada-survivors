import { Application, Graphics } from "pixi.js";
import { Entity } from "../Entity";
import { Player } from "../Player";

export class PlayerStatus extends Entity {
  private barWidth = 120;
  private barHeight = 16;
  healthValueRect: Graphics;

  constructor(
    app: Application,
    public player: Player,
  ) {
    super(app);

    this.container.position.x = 4;
    this.container.position.y = 4;

    const backRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill({ color: 0x666666 });
    this.container.addChild(backRect);
    this.healthValueRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill(0x00ff00);
    this.container.addChild(this.healthValueRect);
    const outlineRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(outlineRect);

    this.player.health.eventDamage.add(() => {
      this.update();
    });
  }

  update() {
    this.healthValueRect
      .clear()
      .rect(0, 0, (this.player.health.currentHealth / this.player.health.maxHealth) * this.barWidth, this.barHeight)
      .fill(0x00ff00);
  }
}
