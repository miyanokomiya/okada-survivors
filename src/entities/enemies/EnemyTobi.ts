import { Application, Container, Graphics, Text } from "pixi.js";
import { Enemy } from "./Enemy";
import gsap from "gsap";
import { applyExEliteEnemyHealth, applyExEnemyHealth } from "../../utils/globalSettings";
import { Vec2 } from "../../utils/geo";

export class EnemyTobi extends Enemy {
  protected radius = 20;
  protected fontSize = 24;
  protected faceText = "跳";
  protected movingTo: Vec2 | undefined;

  constructor(app: Application) {
    super(app);
    this.init();
  }

  protected init() {
    this.movement.maxSpeed = 120;
    this.movement.acceleration = 0.1;
    this.movement.friction = 200;
    this.health.init(applyExEliteEnemyHealth(applyExEnemyHealth(5)));

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
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      }),
    );

    this.anims.push(
      gsap.to(
        {},
        {
          duration: 1,
          repeat: -1,
          onRepeat: () => {
            this.pauseMoving = !this.pauseMoving;
          },
        },
      ),
    );
  }

  moveTo(p: Vec2) {
    if (this.pauseMoving) {
      this.movingTo = { x: p.x, y: p.y };
      return;
    }

    if (this.movingTo) {
      super.moveTo(this.movingTo);
    }
  }
}
