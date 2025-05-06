import { Application, Container, Sprite, Text, Texture } from "pixi.js";
import { Entity } from "../Entity";
import { CTimer } from "../../components/CTimer";
import { easeOut, lerpValue, Vec2 } from "../../utils/geo";
import star10 from "../../assets/star10.svg";

export class DamageLabel extends Entity {
  private lifetime = new CTimer(30);
  private text: Text;
  private orgPosition: Vec2 = { x: 0, y: 0 };

  constructor(app: Application, value: number) {
    super(app);

    const size = 24;
    const fontSize = 14;
    const sprite = new Sprite({
      texture: Texture.from(star10),
      width: size,
      height: size,
    });
    this.container.addChild(sprite);

    this.text = new Text({
      text: `${value}`,
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });

    this.text.anchor.set(0.5);
    this.text.x = size / 2;
    this.text.y = size / 2;
    this.container.addChild(this.text);

    this.container.scale.set(0.1);

    this.lifetime.start();
    this.lifetime.onFinish = () => {
      this.dispose = true;
    };
  }

  spawnAt(parent: Container | undefined, p: Vec2, randomize = false): void {
    const range = 20;
    this.container.x = p.x + (randomize ? Math.random() * range - range / 2 : 0);
    this.container.y = p.y + (randomize ? Math.random() * range - range / 2 : 0);
    this.orgPosition = { x: p.x, y: p.y };
    this.spawn(parent);
  }

  tick(deltaFrame: number): void {
    this.lifetime.tick(deltaFrame);
    const t = easeOut(this.lifetime.getProgress());
    this.container.y = lerpValue(this.orgPosition.y, this.orgPosition.y - 20, t);
    this.container.scale.set(lerpValue(0.1, 1, t));
  }
}
