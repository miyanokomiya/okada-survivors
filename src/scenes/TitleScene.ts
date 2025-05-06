import { Application, Container, Graphics, Text } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { MainScene } from "./MainScene";
import { createTextButton } from "../utils/uis";
import { AscensionScene } from "./AscensionScene";

export class TitleScene extends SceneBase {
  constructor(app: Application) {
    super(app);

    const container = new Container();
    app.stage.addChild(container);

    const width = app.screen.width;
    const height = app.screen.height;

    const titleText = new Text({
      text: "Okada Survivors",
      style: { fontSize: 64, fill: 0x000000, fontWeight: "500" },
    });
    titleText.anchor.set(0.5);
    titleText.position.set(width / 2, height / 2 - 90);
    container.addChild(titleText);

    const startText = new Text({
      text: "Click to Start",
      style: { fontSize: 32, fill: 0x000000, fontWeight: "400" },
    });
    startText.anchor.set(0.5);
    startText.position.set(width / 2, height / 2);
    container.addChild(startText);

    const guideText = new Text({
      text: "Move: WASD, Arrow Keys, Virtual Joystick\nSelect: Click, Touch",
      style: { fontSize: 20, fill: 0x000000, fontWeight: "400" },
    });
    guideText.anchor.set(0.5);
    guideText.position.set(width / 2, height / 2 + 80);
    container.addChild(guideText);

    const creditsText = new Text({
      text: "Sound Effects: 魔王魂",
      style: { fontSize: 20, fill: 0x000000, fontWeight: "400" },
    });
    creditsText.anchor.set(0.5);
    creditsText.position.set(width / 2, height / 2 + 140);
    container.addChild(creditsText);

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0xffffff, alpha: 0 });
    container.addChild(overlay);
    overlay.interactive = true;
    overlay.on("pointerdown", () => {
      this.destroy();
      new MainScene(app);
    });

    const ascensionButton = createTextButton("Ascensions", 160, 60, 20);
    ascensionButton.position.set(width / 2 - ascensionButton.width / 2, height / 2 + 180);
    container.addChild(ascensionButton);
    ascensionButton.interactive = true;
    ascensionButton.on("pointerdown", () => {
      this.destroy();
      new AscensionScene(app);
    });
  }
}
