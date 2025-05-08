import { Application, Container, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";
import gsap from "gsap";
import { applyExEnemyHealth } from "../../utils/globalSettings";

export class EnemyTeki extends Enemy {
  protected radius = 16;
  protected fontSize = 20;
  protected faceText = "敵";

  constructor(app: Application) {
    super(app);
    this.init();
  }

  protected init() {
    this.movement.maxSpeed = 50;
    this.movement.acceleration = 0.1;
    this.health.init(applyExEnemyHealth(3));

    const graphicContainer = new Container();
    this.container.addChild(graphicContainer);

    const radius = this.radius;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
    graphicContainer.addChild(graphics);

    const fontSize = this.fontSize;
    const text = new Text({
      text: this.faceText,
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    graphicContainer.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.pushoutHitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];

    graphicContainer.angle = 15;
    this.anims.push(
      gsap.to(graphicContainer, {
        angle: -15,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }),
    );
  }
}
