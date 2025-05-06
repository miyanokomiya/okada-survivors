import { Application, Container, Graphics, Text } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { MainScene } from "./MainScene";

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
    titleText.position.set(width / 2, height / 2 - 64);
    container.addChild(titleText);

    const startText = new Text({
      text: "Click to Start",
      style: { fontSize: 32, fill: 0x000000, fontWeight: "400" },
    });
    startText.anchor.set(0.5);
    startText.position.set(width / 2, height / 2 + 32);
    container.addChild(startText);

    const guideText = new Text({
      text: "Move: WASD, Arrow Keys\nSelect: Click",
      style: { fontSize: 20, fill: 0x000000, fontWeight: "400" },
    });
    guideText.anchor.set(0.5);
    guideText.position.set(width / 2, height / 2 + 120);
    container.addChild(guideText);

    const overlay = new Graphics().rect(0, 0, width, height).fill({ color: 0xffffff, alpha: 0 });
    container.addChild(overlay);
    overlay.interactive = true;
    overlay.on("pointerdown", () => {
      this.destroy();
      new MainScene(app);
    });
  }
}
