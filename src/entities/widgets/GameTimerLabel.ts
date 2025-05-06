import { Application, Text } from "pixi.js";
import { Entity } from "../Entity";
import { getEnemyContaienr } from "../../utils/containers";

export class GameTimerLabel extends Entity {
  private timerText: Text;

  constructor(app: Application) {
    super(app);

    this.timerText = new Text({
      text: `00:00 Lv.1`,
      style: {
        fontSize: 24,
        fill: 0x000000,
        stroke: 0xffffff,
        fontWeight: "500",
      },
    });
    this.container.addChild(this.timerText);
  }

  update(time: number, level: number) {
    const enemyCount = (getEnemyContaienr(this.app)?.children ?? []).length;
    const totalSecond = Math.floor(time / 60);
    const minute = Math.floor(totalSecond / 60);
    const second = Math.floor(totalSecond % 60);
    this.timerText.text = [
      `${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`,
      `Lv.${level.toString().padStart(2, "0")}`,
      `☆${enemyCount.toString().padStart(4, "0")}`,
    ].join("    ");
  }
}
