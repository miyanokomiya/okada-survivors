import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { CUpgrade } from "../../components/CUpgrade";
import { Upgrade } from "../../utils/upgrades";
import gsap from "gsap";
import { LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";

export class UpgradeMenu extends Entity {
  private optionContaienr: Container;

  constructor(
    app: Application,
    public upgradeComponent: CUpgrade,
  ) {
    super(app);
    this.tickLayer = LAYER_OVERLAY;

    const overlay = new Graphics()
      .rect(0, 0, app.screen.width, app.screen.height)
      .fill({ color: 0x888888, alpha: 0.5 });
    this.container.addChild(overlay);
    this.hide();

    this.optionContaienr = new Container();
    this.container.addChild(this.optionContaienr);
  }

  display() {
    const upgrades = this.upgradeComponent.getOptions();
    if (upgrades.length === 0) return;

    pauseLayerMain(this.app);
    this.container.visible = true;

    this.optionContaienr.removeChildren();
    const margin = 20;
    upgrades.forEach((upgrade, index) => {
      const button = this.createUpgradeButton(upgrade);
      button.x = index * (button.width + margin);
      button.interactive = true;
      button.on("pointerdown", () => {
        this.chooseUpgrade(upgrade, button);
      });
      this.optionContaienr.addChild(button);
    });
    this.optionContaienr.x = this.app.screen.width / 2 - this.optionContaienr.width / 2;
    this.optionContaienr.y = this.app.screen.height / 2 - this.optionContaienr.height / 2;
  }

  hide() {
    this.container.visible = false;
    resumeLayerMain(this.app);
  }

  private chooseUpgrade(upgrade: Upgrade, button: Container) {
    button.position.x += button.width / 2;
    button.position.y += button.height / 2;
    button.pivot.set(button.width / 2, button.height / 2);
    gsap
      .to(button.scale, {
        x: 1.2,
        y: 1.2,
        duration: 0.5,
      })
      .then(() => {
        this.upgradeComponent.chooseOption(upgrade);
        this.hide();
      });
    const y = button.y;
    gsap.to(button.position, {
      y: y - 20,
      duration: 0.4,
    });
    gsap
      .to(button, {
        angle: -15,
        duration: 0.2,
      })
      .then(() => {
        gsap.to(button, {
          angle: 20,
          duration: 0.2,
        });
      });
  }

  private createUpgradeButton(upgrade: Upgrade): Container {
    const width = 200;
    const height = 200;
    const wrapper = new Container();

    const button = new Container();
    button.position.set(width / 2, height / 2);
    button.pivot.set(width / 2, height / 2);
    wrapper.addChild(button);

    const outline = new Graphics()
      .roundRect(0, 0, width, height, 5)
      .fill(0xaaaaaa)
      .stroke({ color: 0x000000, width: 2 });
    button.addChild(outline);

    const nameText = new Text({
      text: upgrade.name,
      style: { fontSize: 20, fill: 0x000000, fontWeight: "500" },
    });
    nameText.anchor.set(0.5);
    nameText.x = outline.width / 2;
    nameText.y = 16;
    button.addChild(nameText);

    const padding = 12;
    const descText = new Text({
      text: upgrade.description,
      style: {
        fontSize: 18,
        fill: 0x000000,
        fontWeight: "400",
        wordWrap: true,
        breakWords: true,
        wordWrapWidth: width - padding * 2,
      },
    });
    descText.x = 12;
    descText.y = 34;
    button.addChild(descText);

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
