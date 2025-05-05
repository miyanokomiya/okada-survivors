import { Application, Container, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";
import gsap from "gsap";

export class EnemyTeki extends Enemy {
  constructor(app: Application) {
    super(app);

    this.movement.maxSpeed = 50;
    this.movement.acceleration = 0.1;
    this.health.init(3);

    const graphicContainer = new Container();
    this.container.addChild(graphicContainer);

    const radius = 16;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
    graphicContainer.addChild(graphics);

    const fontSize = 20;
    const text = new Text({
      text: "敵",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2 - 2;
    graphicContainer.addChild(text);

    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius }];
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius }];

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
