import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";
import { EventTrigger } from "../../utils/EventTrigger";
import gsap from "gsap";

export class GameOverMenu extends Entity {
  eventRetry: EventTrigger<void> = new EventTrigger();
  private clearContainer: Container;
  private overContainer: Container;

  constructor(app: Application) {
    super(app);
    this.tickLayer = LAYER_OVERLAY;

    const width = app.screen.width;
    const height = app.screen.height;

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0x888888, alpha: 0.5 });
    this.container.addChild(overlay);
    this.hide();

    {
      this.clearContainer = new Container();
      this.clearContainer.visible = false;
      this.container.addChild(this.clearContainer);

      const text = new Text({
        text: "Game Clear",
        style: { fontSize: 64, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
      });
      text.anchor.set(0.5);
      text.position.set(width / 2, height / 2 - 64);
      this.clearContainer.addChild(text);

      const retryButton = this.createButton("Retry", 160, 60);
      retryButton.pivot.set(80, 30);
      retryButton.position.set(width / 2, height / 2 + 48);
      retryButton.interactive = true;
      retryButton.on("pointerdown", () => {
        this.eventRetry.trigger();
        this.hide();
      });
      this.clearContainer.addChild(retryButton);
    }

    {
      this.overContainer = new Container();
      this.overContainer.visible = false;
      this.container.addChild(this.overContainer);

      const text = new Text({
        text: "Game Over",
        style: { fontSize: 64, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
      });
      text.anchor.set(0.5);
      text.position.set(width / 2, height / 2 - 64);
      this.overContainer.addChild(text);

      const retryButton = this.createButton("Retry", 160, 60);
      retryButton.pivot.set(80, 30);
      retryButton.position.set(width / 2, height / 2 + 48);
      retryButton.interactive = true;
      retryButton.on("pointerdown", () => {
        this.eventRetry.trigger();
        this.hide();
      });
      this.overContainer.addChild(retryButton);
    }
  }

  displayClear() {
    pauseLayerMain(this.app);
    this.container.visible = true;
    this.clearContainer.visible = true;
    this.overContainer.visible = false;
  }

  displayOver() {
    pauseLayerMain(this.app);
    this.container.visible = true;
    this.clearContainer.visible = false;
    this.overContainer.visible = true;
  }

  hide() {
    this.container.visible = false;
    resumeLayerMain(this.app);
  }

  private createButton(text: string, width: number, height: number): Container {
    const wrapper = new Container();
    const button = new Container();
    button.pivot.set(width / 2, height / 2);
    button.position.set(width / 2, height / 2);
    wrapper.addChild(button);

    const outline = new Graphics()
      .roundRect(0, 0, width, height, 5)
      .fill(0xaaaaaa)
      .stroke({ color: 0x000000, width: 2 });
    button.addChild(outline);

    const nameText = new Text({
      text,
      style: { fontSize: 36, fill: 0x000000, fontWeight: "400" },
    });
    nameText.anchor.set(0.5);
    nameText.x = outline.width / 2;
    nameText.y = outline.height / 2;
    button.addChild(nameText);

    wrapper.on("pointerenter", () => {
      gsap.to(button.scale, {
        x: 1.05,
        y: 1.05,
        duration: 0.05,
      });
    });
    wrapper.on("pointerleave", () => {
      gsap.to(button.scale, {
        x: 1,
        y: 1,
        duration: 0.05,
      });
    });

    return wrapper;
  }
}
