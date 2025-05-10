import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { CUpgrade } from "../../components/CUpgrade";
import { Upgrade } from "../../utils/upgrades";
import gsap from "gsap";
import { LAYER_OVERLAY, pauseLayerMain, resumeLayerMain } from "../../utils/tickLayers";
import { SceneBase } from "../../scenes/SceneBase";
import { getDirectionalMovement, getSubmitInput } from "../../utils/inputs";

export class UpgradeMenu extends Entity {
  private optionContaienr: Container;
  private selectedGraphics: Graphics;
  private textLabel: Text;
  private selected = -1;
  private chosen = false;
  private upgrades: Upgrade[] | undefined;

  constructor(
    app: Application,
    public scene: SceneBase,
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

    this.textLabel = new Text({
      text: "← ↑ → Space",
      style: { fontSize: 18, fill: 0x000000 },
    });
    this.textLabel.anchor.set(0.5, 0);
    this.textLabel.x = app.screen.width / 2;
    this.container.addChild(this.textLabel);

    this.selectedGraphics = new Graphics();
    this.selectedGraphics.visible = false;
    this.container.addChild(this.selectedGraphics);
  }

  display(initial = false) {
    this.selected = -1;
    this.chosen = false;
    this.selectedGraphics.visible = false;
    const upgrades = initial ? this.upgradeComponent.getInitialOptions() : this.upgradeComponent.getOptions();
    this.upgrades = upgrades;
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

    this.textLabel.y = this.optionContaienr.y + this.optionContaienr.height + 20;
  }

  hide() {
    this.container.visible = false;
    resumeLayerMain(this.app);
  }

  private chooseUpgrade(upgrade: Upgrade, button: Container) {
    this.chosen = true;
    this.selected = -1;
    this.selectedGraphics.visible = false;
    button.zIndex = 1;
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

  tick() {
    if (!this.container.visible) return;
    if (this.chosen) return;

    const options = this.optionContaienr.children;
    const v = getDirectionalMovement(this.scene.keyPressState);

    if (this.selected < 0) {
      if (v.x < 0) {
        this.selected = 0;
      } else if (v.x > 0) {
        this.selected = options.length - 1;
      } else if (options.length === 3 && v.y < 0) {
        this.selected = 1;
      }
    } else {
      if (options.length === 3 && v.y < 0) {
        this.selected = 1;
      } else {
        this.selected = Math.max(0, Math.min(options.length - 1, this.selected + Math.sign(v.x)));
      }
    }

    if (this.selected >= 0 && options[this.selected]) {
      this.selectedGraphics.clear();
      this.selectedGraphics.visible = true;
      this.selectedGraphics
        .roundRect(0, 0, options[this.selected].width, options[this.selected].height, 5)
        .stroke({ color: 0xeeee00, width: 4 });
      this.selectedGraphics.x = options[this.selected].x + this.optionContaienr.x - 1;
      this.selectedGraphics.y = options[this.selected].y + this.optionContaienr.y - 1;
    } else {
      this.selectedGraphics.visible = false;
    }

    if (getSubmitInput(this.scene.keyPressState) && this.selected >= 0) {
      if (this.selected >= 0 && this.upgrades?.[this.selected]) {
        this.chooseUpgrade(this.upgrades[this.selected], options[this.selected]);
      }
    }
  }
}
