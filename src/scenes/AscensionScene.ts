import { Application, Container, Text } from "pixi.js";
import { SceneBase } from "./SceneBase";
import { MainScene } from "./MainScene";
import { AscensionMenu } from "../entities/widgets/AscensionMenu";
import { createTextButton } from "../utils/uis";

export class AscensionScene extends SceneBase {
  constructor(app: Application) {
    super(app);

    const container = new Container();
    app.stage.addChild(container);

    const width = app.screen.width;

    const titleText = new Text({
      text: "Ascensions",
      style: { fontSize: 48, fill: 0x000000, fontWeight: "500" },
    });
    titleText.anchor.set(0.5, 0);
    titleText.position.set(width / 2, 0);
    container.addChild(titleText);

    const ascensionMenu = new AscensionMenu(app);
    ascensionMenu.container.position.set(
      width / 2 - ascensionMenu.container.width / 2,
      titleText.y + titleText.height + 20,
    );
    ascensionMenu.spawn(container);

    const startButton = createTextButton("Start", 160, 60, 20);
    startButton.position.set(
      width / 2 - startButton.width / 2,
      ascensionMenu.container.y + ascensionMenu.container.height + 20,
    );
    container.addChild(startButton);
    startButton.interactive = true;
    startButton.on("pointerdown", () => {
      this.destroy();
      new MainScene(app);
    });

    container.position.set(0, (app.screen.height - container.height) / 2);
  }
}
