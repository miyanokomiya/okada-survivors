import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { isPausedLayerMain, LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";
import { SceneBase } from "../../scenes/SceneBase";

export class PauseMenu extends Entity {
  private innerContainer: Container;

  constructor(
    app: Application,
    public scene: SceneBase,
  ) {
    super(app);
    this.tickLayer = LAYER_OVERLAY;

    const width = app.screen.width;
    const height = app.screen.height;

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0x888888, alpha: 0.5 });
    this.container.addChild(overlay);
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);

    const text = new Text({
      text: "Paused",
      style: { fontSize: 64, fill: 0x000000, fontWeight: "500" },
    });
    text.anchor.set(0.5, 0);
    text.x = width / 2;
    this.innerContainer.addChild(text);

    this.innerContainer.y = height / 2 - this.innerContainer.height / 2;
    this.hide();
  }

  display() {
    if (isPausedLayerMain(this.app)) return;

    this.container.visible = true;
    pauseLayerMain(this.app);
  }

  toggle() {
    this.container.visible ? this.hide() : this.display();
  }

  hide() {
    this.container.visible = false;
    resumeLayerMain(this.app);
  }
}
