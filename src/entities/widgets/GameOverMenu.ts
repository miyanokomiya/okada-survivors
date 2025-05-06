import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";
import { EventTrigger } from "../../utils/EventTrigger";
import { createTextButton } from "../../utils/uis";
import { getActiveAscension } from "../../utils/globalSettings";

export class GameOverMenu extends Entity {
  eventRetry: EventTrigger<void> = new EventTrigger();
  eventAscension: EventTrigger<void> = new EventTrigger();
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

      const text = new Text({
        text: "Game Clear",
        style: { fontSize: 64, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
      });
      text.anchor.set(0.5, 0);
      text.position.set(width / 2, 0);
      this.clearContainer.addChild(text);

      const retryButton = createTextButton("Retry", 160, 60, 20);
      retryButton.pivot.set(80, 0);
      retryButton.position.set(width / 2, this.clearContainer.y + this.clearContainer.height + 30);
      retryButton.interactive = true;
      retryButton.on("pointerdown", () => {
        this.eventRetry.trigger();
        this.hide();
      });
      this.clearContainer.addChild(retryButton);

      const ascensionContainer = this.createAscensionContainer(width);
      ascensionContainer.position.set(0, retryButton.y + retryButton.height + 30);
      this.clearContainer.addChild(ascensionContainer);

      this.clearContainer.position.set(0, height / 2 - this.clearContainer.height / 2);
      this.container.addChild(this.clearContainer);
    }

    {
      this.overContainer = new Container();
      this.overContainer.visible = false;

      const text = new Text({
        text: "Game Over",
        style: { fontSize: 64, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
      });
      text.anchor.set(0.5, 0);
      text.position.set(width / 2, 0);
      this.overContainer.addChild(text);

      const retryButton = createTextButton("Retry", 160, 60, 20);
      retryButton.pivot.set(80, 0);
      retryButton.position.set(width / 2, this.overContainer.y + this.overContainer.height + 30);
      retryButton.interactive = true;
      retryButton.on("pointerdown", () => {
        this.eventRetry.trigger();
        this.hide();
      });
      this.overContainer.addChild(retryButton);

      const ascensionContainer = this.createAscensionContainer(width);
      ascensionContainer.position.set(0, retryButton.y + retryButton.height + 30);
      this.overContainer.addChild(ascensionContainer);

      this.overContainer.position.set(0, height / 2 - this.overContainer.height / 2);
      this.container.addChild(this.overContainer);
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

  private createAscensionContainer(width: number) {
    const ascensionCotainer = new Container();
    const ascensionsCotainer = new Container();
    Array.from(getActiveAscension())
      .sort((a, b) => a - b)
      .forEach((ascension, index) => {
        const ascensionCotainer = new Container();
        const radius = 20;
        const circle = new Graphics()
          .circle(radius, radius, radius)
          .fill({ color: 0xffffff })
          .stroke({ color: 0x000000, width: 2 });
        ascensionCotainer.addChild(circle);

        const ascensionText = new Text({
          text: `A${ascension.toString().padStart(2, "0")}`,
          style: { fontSize: 16, fill: 0x000000, stroke: 0xffffff, fontWeight: "400" },
        });
        ascensionText.anchor.set(0.5, 0.5);
        ascensionText.position.set(radius, radius);
        ascensionCotainer.addChild(ascensionText);

        ascensionCotainer.position.set(
          (ascensionCotainer.width + 10) * (index % 10),
          (ascensionCotainer.height + 10) * Math.floor(index / 10),
        );
        ascensionsCotainer.addChild(ascensionCotainer);
      });
    ascensionsCotainer.position.set(width / 2 - ascensionsCotainer.width / 2, 0);
    ascensionCotainer.addChild(ascensionsCotainer);

    const ascensionButton = createTextButton("Ascensions", 160, 60, 20);
    ascensionButton.pivot.set(80, 0);
    ascensionButton.position.set(width / 2, ascensionsCotainer.height + 30);
    ascensionButton.interactive = true;
    ascensionButton.on("pointerdown", () => {
      this.eventAscension.trigger();
      this.hide();
    });
    ascensionCotainer.addChild(ascensionButton);

    return ascensionCotainer;
  }
}
