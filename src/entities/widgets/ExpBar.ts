import { Application, Graphics } from "pixi.js";
import { Entity } from "../Entity";
import { CExpLevel } from "../../components/CExpLevel";

export class ExpBar extends Entity {
  private width;
  private height = 18;
  private valueRect: Graphics;

  constructor(
    app: Application,
    public expLevel: CExpLevel,
  ) {
    super(app);

    this.width = app.screen.width;
    const backRect = new Graphics()
      .rect(0, app.screen.height - this.height, this.width, this.height)
      .fill({ color: 0x666666 });
    this.container.addChild(backRect);
    this.valueRect = new Graphics();
    this.container.addChild(this.valueRect);
    const outlineRect = new Graphics()
      .rect(0, app.screen.height - this.height, this.width, this.height)
      .stroke({ color: 0x000000, width: 2 });
    this.container.addChild(outlineRect);

    expLevel.eventLevelup.add(() => {
      this.fulfill();
    });
    expLevel.eventExpChange.add(() => {
      this.update();
    });
    this.update();
  }

  private update(): void {
    this.valueRect
      .clear()
      .rect(0, this.app.screen.height - this.height, this.width * this.expLevel.getExpPercent(), this.height)
      .fill(0xdddddd);
  }

  private fulfill(): void {
    this.valueRect
      .clear()
      .rect(0, this.app.screen.height - this.height, this.width, this.height)
      .fill(0xdddddd);
  }
}
