import { Application, Container, Text } from "pixi.js";
import { Entity } from "../Entity";
import { CTimer } from "../../components/CTimer";
import { easeOut, lerpValue, Vec2 } from "../../utils/geo";

export class DamageLabel extends Entity {
  private lifetime = new CTimer(60);
  private text: Text;
  private orgPosition: Vec2 = { x: 0, y: 0 };

  constructor(app: Application, value: number) {
    super(app);

    const fontSize = 10;
    this.text = new Text({
      text: `${value}`,
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });

    const range = 10;
    this.text.x = -fontSize / 2 + Math.random() * range - range / 2;
    this.text.y = -fontSize / 2 + Math.random() * range - range / 2;
    this.container.addChild(this.text);

    this.lifetime.start();
    this.lifetime.onFinish = () => {
      this.dispose = true;
    };
  }

  spawnAt(parent: Container | undefined, p: Vec2): void {
    this.container.x = p.x;
    this.container.y = p.y;
    this.orgPosition = { x: p.x, y: p.y };
    this.spawn(parent);
  }

  tick(deltaFrame: number): void {
    this.lifetime.tick(deltaFrame);
    const t = easeOut(this.lifetime.getProgress());
    this.container.y = lerpValue(this.orgPosition.y, this.orgPosition.y - 20, t);
    this.text.style.fontSize = lerpValue(10, 20, t);
  }
}
