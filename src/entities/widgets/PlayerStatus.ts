import { Application, Graphics, Text } from "pixi.js";
import { Entity } from "../Entity";
import { Player } from "../Player";

export class PlayerStatus extends Entity {
  private barWidth = 120;
  private barHeight = 16;
  healthValueRect: Graphics;
  statusText: Text;

  constructor(
    app: Application,
    public player: Player,
  ) {
    super(app);

    this.container.position.x = 4;
    this.container.position.y = 4;

    const backRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill({ color: 0x666666 });
    this.container.addChild(backRect);
    this.healthValueRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).fill(0x00ff00);
    this.container.addChild(this.healthValueRect);
    const outlineRect = new Graphics().rect(0, 0, this.barWidth, this.barHeight).stroke({ color: 0x000000, width: 2 });
    this.container.addChild(outlineRect);

    this.statusText = new Text({
      text: "",
      style: { fontSize: 16, fill: 0x000000, fontWeight: "400" },
    });
    this.statusText.position.set(0, this.container.y + this.container.height);
    this.container.addChild(this.statusText);

    this.player.health.eventChange.add(() => {
      this.update();
    });
    this.player.eventStatusChange.add(() => {
      this.update();
    });
    this.update();
  }

  update() {
    this.healthValueRect
      .clear()
      .rect(0, 0, (this.player.health.currentHealth / this.player.health.maxHealth) * this.barWidth, this.barHeight)
      .fill(0x00ff00);

    const attacks = this.player.attacks.map((attack) => {
      let label = attack.name;
      if (attack.level > 1) {
        label += `+${attack.level - 1}`;
      }
      return label;
    });
    this.statusText.text = attacks.join("\n");

    const attracts = this.player.upgrades.filter((upgrade) => upgrade.id === "attract");
    if (attracts.length > 0) {
      this.statusText.text += `\n引き寄せ+${attracts.length}`;
    }
  }
}
