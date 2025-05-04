import { Application, Container, Graphics } from "pixi.js";
import { Entity } from "../Entity";

export class Healthbar extends Entity {
  private width = 50;
  private height = 12;
  valueRect: Graphics;

  constructor(app: Application) {
    super(app);

    this.valueRect = new Graphics().roundRect(-this.width / 2, 0, this.width, this.height).fill(0x00ff00);
    this.container.addChild(this.valueRect);
    const outlineRect = new Graphics()
      .roundRect(-this.width / 2, 0, this.width, this.height)
      .stroke({ color: 0x000000, width: 2 });
    this.container.addChild(outlineRect);
  }

  spawn(parent: Container): void {
    super.spawn(parent);
    this.container.position.y -= parent.height + 2;
  }

  update(health: number, maxHealth: number) {
    this.valueRect
      .clear()
      .roundRect(-this.width / 2, 0, (health / maxHealth) * this.width, this.height)
      .fill(0x00ff00);
  }
}
