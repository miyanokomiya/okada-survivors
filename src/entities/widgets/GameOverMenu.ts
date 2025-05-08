import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";
import { EventTrigger } from "../../utils/EventTrigger";
import { createTextButton } from "../../utils/uis";
import { getActiveAscension } from "../../utils/globalSettings";
import { Player } from "../Player";
import { getSubmitInput } from "../../utils/inputs";
import { SceneBase } from "../../scenes/SceneBase";

export class GameOverMenu extends Entity {
  eventRetry: EventTrigger<void> = new EventTrigger();
  eventAscension: EventTrigger<void> = new EventTrigger();
  private innerContainer: Container;

  constructor(
    app: Application,
    public scene: SceneBase,
    public player: Player,
  ) {
    super(app);
    this.tickLayer = LAYER_OVERLAY;

    const width = app.screen.width;
    const height = app.screen.height;

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0x888888, alpha: 0.5 });
    this.container.addChild(overlay);
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);
    this.hide();
  }

  displayClear() {
    pauseLayerMain(this.app);
    this.innerContainer.destroy();
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);
    this.initClear();
    this.container.visible = true;
  }

  displayOver() {
    pauseLayerMain(this.app);
    this.innerContainer.destroy();
    this.innerContainer = new Container();
    this.container.addChild(this.innerContainer);
    this.initOver();
    this.container.visible = true;
  }

  initClear() {
    const width = this.app.screen.width;
    const height = this.app.screen.height;

    const text = new Text({
      text: "Game Clear",
      style: { fontSize: 64, fill: 0x000000, fontWeight: "500" },
    });
    text.anchor.set(0.5, 0);
    text.position.set(width / 2, 0);
    this.innerContainer.addChild(text);

    const retryButton = createTextButton("Retry (Space)", 160, 60, 20);
    retryButton.pivot.set(80, 0);
    retryButton.position.set(width / 2, this.innerContainer.height + 20);
    retryButton.interactive = true;
    retryButton.on("pointerdown", () => {
      this.eventRetry.trigger();
      this.hide();
    });
    this.innerContainer.addChild(retryButton);

    const upgradeContainer = this.createUpgradeInfo(width);
    upgradeContainer.position.set(0, retryButton.y + retryButton.height + 20);
    this.innerContainer.addChild(upgradeContainer);

    const ascensionContainer = this.createAscensionContainer(width);
    ascensionContainer.position.set(0, upgradeContainer.y + upgradeContainer.height + 20);
    this.innerContainer.addChild(ascensionContainer);

    const versionText = this.createVersionText();
    versionText.anchor.set(0.5, 0);
    versionText.position.set(width / 2, this.innerContainer.height + 20);
    this.innerContainer.addChild(versionText);

    this.innerContainer.position.set(0, height / 2 - this.innerContainer.height / 2);
    this.container.addChild(this.innerContainer);
  }

  initOver() {
    const width = this.app.screen.width;
    const height = this.app.screen.height;

    const text = new Text({
      text: "Game Over",
      style: { fontSize: 64, fill: 0x000000, fontWeight: "500" },
    });
    text.anchor.set(0.5, 0);
    text.position.set(width / 2, 0);
    this.innerContainer.addChild(text);

    const retryButton = createTextButton("Retry (Space)", 160, 60, 20);
    retryButton.pivot.set(80, 0);
    retryButton.position.set(width / 2, this.innerContainer.height + 20);
    retryButton.interactive = true;
    retryButton.on("pointerdown", () => {
      this.eventRetry.trigger();
      this.hide();
    });
    this.innerContainer.addChild(retryButton);

    const upgradeContainer = this.createUpgradeInfo(width);
    upgradeContainer.position.set(0, retryButton.y + retryButton.height + 20);
    this.innerContainer.addChild(upgradeContainer);

    const ascensionContainer = this.createAscensionContainer(width);
    ascensionContainer.position.set(0, upgradeContainer.y + upgradeContainer.height + 20);
    this.innerContainer.addChild(ascensionContainer);

    const versionText = this.createVersionText();
    versionText.anchor.set(0.5, 0);
    versionText.position.set(width / 2, this.innerContainer.height + 20);
    this.innerContainer.addChild(versionText);

    this.innerContainer.position.set(0, height / 2 - this.innerContainer.height / 2);
    this.container.addChild(this.innerContainer);
  }

  hide() {
    this.container.visible = false;
    resumeLayerMain(this.app);
  }

  private createAscensionContainer(width: number) {
    const ascensionCotainer = new Container();
    const ascensions = Array.from(getActiveAscension()).sort((a, b) => a - b);

    if (ascensions.length > 0) {
      const ascensionsCotainer = new Container();
      ascensions.forEach((ascension, index) => {
        const ascensionCotainer = new Container();
        const radius = 20;
        const circle = new Graphics()
          .circle(radius, radius, radius)
          .fill({ color: 0xffffff })
          .stroke({ color: 0x000000, width: 2 });
        ascensionCotainer.addChild(circle);

        const ascensionText = new Text({
          text: `A${ascension.toString().padStart(2, "0")}`,
          style: { fontSize: 16, fill: 0x000000, fontWeight: "400" },
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
    }

    const ascensionButton = createTextButton("Ascensions", 160, 60, 20);
    ascensionButton.pivot.set(80, 0);
    ascensionButton.position.set(width / 2, ascensionCotainer.height + 20);
    ascensionButton.interactive = true;
    ascensionButton.on("pointerdown", () => {
      this.eventAscension.trigger();
      this.hide();
    });
    ascensionCotainer.addChild(ascensionButton);

    return ascensionCotainer;
  }

  private createVersionText() {
    const text = new Text({
      text: process.env.__APP_VERSION__,
      style: { fontSize: 18, fill: 0x000000, fontWeight: "400" },
    });
    return text;
  }

  private createUpgradeInfo(width: number): Container {
    const container = new Container();
    const upgrades = new Container();
    const margin = 6;
    const lineCount = 10;
    let x = 0;
    this.player.upgrades.forEach((upgrade, index) => {
      const con = new Container();
      const back = new Graphics();
      const text = new Text({
        text: `${upgrade.name}`,
        style: { fontSize: 14, fill: 0x000000, fontWeight: "400" },
      });
      text.position.set(4 + back.x, 2 + back.y);
      back.roundRect(0, 0, text.width + 8, 18, 5).fill({ color: 0xffffff });
      con.addChild(back);
      con.addChild(text);
      con.position.x = x;
      con.position.y = Math.floor(index / lineCount) * (back.height + margin);
      upgrades.addChild(con);

      if (index % lineCount === lineCount - 1) {
        x = 0;
      } else {
        x = con.x + con.width + margin;
      }
    });
    upgrades.position.set(width / 2 - upgrades.width / 2, 0);
    container.addChild(upgrades);
    return container;
  }

  tick() {
    if (!this.container.visible) return;

    if (getSubmitInput(this.scene.keyPressState)) {
      this.eventRetry.trigger();
      this.hide();
    }
  }
}
