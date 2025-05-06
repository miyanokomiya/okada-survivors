import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import gsap from "gsap";
import { ASCENZTION_ITEMS, getActiveAscension, setActiveAscension } from "../../utils/globalSettings";

export class AscensionMenu extends Entity {
  private allButton: AscensionButton;
  private buttons: AscensionButton[] = [];

  constructor(app: Application) {
    super(app);

    const activeAscensions = getActiveAscension();
    const allButton = new AscensionButton("All", "全てON/OFF", activeAscensions.size === ASCENZTION_ITEMS.length);
    allButton.container.interactive = true;
    allButton.container.on("pointerdown", () => {
      ASCENZTION_ITEMS.forEach((item) => {
        setActiveAscension(item.ascension, !allButton.active);
      });
      this.updateAllButtons();
    });
    this.container.addChild(allButton.container);
    this.allButton = allButton;

    ASCENZTION_ITEMS.forEach((item, index) => {
      const button = new AscensionButton(
        `A${item.ascension.toString().padStart(2, "0")}`,
        item.description,
        activeAscensions.has(item.ascension),
      );
      const x = (button.container.width + 10) * (index % 5);
      const y = (1 + Math.floor(index / 5)) * (button.container.height + 10);
      button.container.position.set(x, y);
      button.container.interactive = true;
      button.container.on("pointerdown", () => {
        setActiveAscension(item.ascension, !activeAscensions.has(item.ascension));
        this.updateAllButtons();
      });
      this.container.addChild(button.container);
      this.buttons.push(button);
    });

    this.container.scale.set(0.7);
  }

  private updateAllButtons() {
    const activeAscensions = getActiveAscension();
    ASCENZTION_ITEMS.forEach(({ ascension }) => {
      const button = this.buttons[ascension - 1];
      if (button) {
        button.setActive(activeAscensions.has(ascension));
      }
    });
    this.allButton.setActive(activeAscensions.size === ASCENZTION_ITEMS.length);
  }
}

class AscensionButton {
  container: Container;
  activeCheckInner: Container | undefined;

  constructor(
    public name: string,
    public description: string,
    public active: boolean,
  ) {
    const button = this.createButton(name, description);
    this.container = button;
  }

  setActive(active: boolean) {
    this.active = active;
    if (this.activeCheckInner) {
      this.activeCheckInner.visible = active;
    }
  }

  private createButton(name: string, description: string): Container {
    const width = 180;
    const height = 52;
    const wrapper = new Container();

    const button = new Container();
    button.position.set(width / 2, height / 2);
    button.pivot.set(width / 2, height / 2);
    wrapper.addChild(button);

    const outline = new Graphics()
      .roundRect(0, 0, width, height, 5)
      .fill(0xcccccc)
      .stroke({ color: 0x000000, width: 2 });
    button.addChild(outline);

    const inner = new Container();
    inner.position.set(4, 4);
    button.addChild(inner);

    const activeCheckContainer = new Container();
    inner.addChild(activeCheckContainer);

    const checkSize = 18;
    const activeCheckOuter = new Graphics()
      .roundRect(0, 0, checkSize, checkSize, 5)
      .fill(0xffffff)
      .stroke({ color: 0x000000, width: 2 });
    activeCheckContainer.addChild(activeCheckOuter);

    this.activeCheckInner = new Graphics().circle(checkSize / 2, checkSize / 2, checkSize / 2 - 2).fill(0x0000ff);
    this.activeCheckInner.visible = this.active;
    activeCheckContainer.addChild(this.activeCheckInner);

    const nameText = new Text({
      text: name,
      style: { fontSize: 16, fill: 0x000000, fontWeight: "400" },
    });
    nameText.position.set(26, 0);
    inner.addChild(nameText);

    const descText = new Text({
      text: description,
      style: {
        fontSize: 18,
        fill: 0x000000,
        fontWeight: "400",
        wordWrap: true,
        breakWords: true,
        wordWrapWidth: width,
      },
    });
    descText.position.set(0, 24);
    inner.addChild(descText);

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
