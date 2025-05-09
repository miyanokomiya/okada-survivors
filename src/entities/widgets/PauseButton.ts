import { Application, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { LAYER_OVERLAY } from "../../utils/tickLayers";
import { EventTrigger } from "../../utils/EventTrigger";

export class PauseButton extends Entity {
  eventPause = new EventTrigger<void>();

  constructor(app: Application) {
    super(app);
    this.tickLayer = LAYER_OVERLAY;

    const width = app.screen.width;
    const height = app.screen.height;

    const buttonW = 90;
    const buttonH = 26;
    const pauseButton = new Graphics()
      .roundRect(0, 0, buttonW, buttonH, 10)
      .fill({ color: 0xcccccc, alpha: 0.5 })
      .stroke({ color: 0x000000, width: 2 });
    const text = new Text({
      text: "Pause (q)",
      style: { fontSize: 16, fill: 0x000000, fontWeight: "400" },
    });
    text.anchor.set(0.5, 0.5);
    text.x = buttonW / 2;
    text.y = buttonH / 2;
    this.container.addChild(pauseButton);
    this.container.addChild(text);

    this.container.x = width - this.container.width - 2;
    this.container.y = height - 50;
    this.container.interactive = true;
    this.container.addEventListener("pointerdown", () => {
      this.eventPause.trigger();
    });
  }
}
