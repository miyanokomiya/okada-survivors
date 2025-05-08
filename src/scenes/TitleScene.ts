import { Application, Container, Graphics, Text } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { MainScene } from "./MainScene";
import { createTextButton } from "../utils/uis";
import { AscensionScene } from "./AscensionScene";
import { getSubmitInput } from "../utils/inputs";

export class TitleScene extends SceneBase {
  constructor(app: Application) {
    super(app);

    const container = new Container();

    const width = app.screen.width;
    const height = app.screen.height;

    const titleText = new Text({
      text: "Okada Survivors",
      style: { fontSize: 64, fill: 0x000000, fontWeight: "500" },
    });
    titleText.anchor.set(0.5, 0);
    titleText.position.set(width / 2, 0);
    container.addChild(titleText);

    const startText = new Text({
      text: "Press to Start",
      style: { fontSize: 32, fill: 0x000000, fontWeight: "400" },
    });
    startText.anchor.set(0.5, 0);
    startText.position.set(width / 2, titleText.y + titleText.height + 20);
    container.addChild(startText);

    const ascensionButton = createTextButton("Ascensions", 160, 60, 20);
    ascensionButton.position.set(width / 2 - ascensionButton.width / 2, startText.y + startText.height + 20);
    container.addChild(ascensionButton);
    ascensionButton.interactive = true;
    ascensionButton.on("pointerdown", () => {
      this.destroy();
      new AscensionScene(app);
    });

    const guideText = new Text({
      text: "Move: ← ↑ →, WASD, Virtual Joystick\nSelect: Pointer, Space",
      style: { fontSize: 18, fill: 0x000000, fontWeight: "400" },
    });
    guideText.anchor.set(0.5, 0);
    guideText.position.set(width / 2, ascensionButton.y + ascensionButton.height + 20);
    container.addChild(guideText);

    const versionText = new Text({
      text: process.env.__APP_VERSION__,
      style: { fontSize: 18, fill: 0x000000, fontWeight: "400" },
    });
    versionText.anchor.set(0.5, 0);
    versionText.position.set(width / 2, guideText.y + guideText.height + 20);
    container.addChild(versionText);

    const creditsText = new Text({
      text: "Sound Effects: 魔王魂",
      style: { fontSize: 18, fill: 0x000000, fontWeight: "400" },
    });
    creditsText.anchor.set(0.5, 0);
    creditsText.position.set(width / 2, versionText.y + versionText.height + 20);
    container.addChild(creditsText);

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0xffffff, alpha: 0 });
    app.stage.addChild(overlay);
    overlay.interactive = true;
    overlay.on("pointerdown", () => {
      this.moveToMainScene();
    });

    container.position.set(0, height / 2 - container.height / 2);
    app.stage.addChild(container);
  }

  moveToMainScene() {
    this.destroy();
    new MainScene(this.app);
  }

  tick() {
    if (getSubmitInput(this.keyPressState)) {
      this.moveToMainScene();
    }
  }
}
