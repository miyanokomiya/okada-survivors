import { Application, Container, Graphics, Text } from "pixi.js";
import { Entity } from "./Entity";
import { CMovement } from "../components/CMovement.ts";
import { CHitbox, CHurtbox } from "../components/CHitbox.ts";
import { CHealth } from "../components/CHealth.ts";
import { CKnockback } from "../components/CKnockback.ts";
import { CAttack } from "../components/attacks/CAttack.ts";
import { CAttackTama } from "../components/attacks/CAttackTama.ts";
import { CExpPick } from "../components/CExpPick.ts";
import { CExpLevel } from "../components/CExpLevel.ts";
import { CAttackUzu } from "../components/attacks/CAttackUzu.ts";
import { CAttackNen } from "../components/attacks/CAttackNen.ts";
import { Upgrade } from "../utils/upgrades.ts";
import { CAttackNami } from "../components/attacks/CAttackNami.ts";
import { getDistanceSquared, Vec2 } from "../utils/geo.ts";
import gsap from "gsap";
import { CAttackTsubu } from "../components/attacks/CAttackTsubu.ts";
import { applyExHeal, applyExPickRange, applyExPlayerHealth, applyExPlayerSpeed } from "../utils/globalSettings.ts";
import { EventTrigger } from "../utils/EventTrigger.ts";

export class Player extends Entity {
  movement: CMovement = new CMovement(applyExPlayerSpeed(100), 1);
  health: CHealth = new CHealth(applyExPlayerHealth(100));
  hitbox: CHitbox;
  hurtbox: CHurtbox;
  hitboxForExp: CHitbox;
  knockback: CKnockback;
  expPick: CExpPick;
  expLevel = new CExpLevel();
  attacks: CAttack[] = [];
  eventStatusChange = new EventTrigger<void>();
  upgrades: Upgrade[] = [];
  gravityBullet = false;

  private radius = 18;
  private walkAnimRight;
  private walkAnimLeft;
  private facing = 1;
  private graphicContainer: Container;

  constructor(app: Application) {
    super(app);

    this.container.label = "player";

    const graphicContainer = new Container();
    this.container.addChild(graphicContainer);
    this.graphicContainer = graphicContainer;

    const radius = this.radius;
    const graphics = new Graphics().circle(0, 0, radius).fill(0xffffff).stroke({ color: 0x000000, width: 2 });
    graphicContainer.addChild(graphics);
    const fontSize = 24;
    const text = new Text({
      text: "岡",
      style: { fontSize, fill: 0x000000, stroke: 0xffffff, fontWeight: "500" },
    });
    text.x = -fontSize / 2;
    text.y = -fontSize / 2;
    graphicContainer.addChild(text);

    this.hitbox = new CHitbox(this.container);
    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: radius }];
    this.hurtbox = new CHurtbox(this.container);
    this.hurtbox.collisions = [{ position: { x: 0, y: 0 }, radius: radius * 0.5 }];
    this.hitboxForExp = new CHitbox(this.container);
    this.hitboxForExp.collisions = [{ position: { x: 0, y: 0 }, radius: applyExPickRange(radius * 1.5) }];

    this.knockback = new CKnockback(this.container);
    this.expPick = new CExpPick(this.app, this.container, this.hitboxForExp);

    this.attacks.push(new CAttackTama(this.app, this.container));
    this.health.eventDeath.add(() => {
      this.onDeath();
    });

    this.walkAnimRight = gsap.to(graphicContainer, {
      angle: 10,
      duration: 0.2,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut",
    });
    this.walkAnimLeft = gsap.to(graphicContainer, {
      angle: -10,
      duration: 0.2,
      repeat: 1,
      yoyo: true,
      ease: "power1.inOut",
    });
    this.walkAnimRight.pause();
    this.walkAnimLeft.pause();
    this.anims.push(this.walkAnimRight, this.walkAnimLeft);
  }

  onDeath() {
    this.hitbox.disabled = true;
    this.hurtbox.disabled = true;
  }

  tick(deltaFrame: number) {
    this.movement.move(this.container, deltaFrame);
    this.hitbox.tick(deltaFrame);
    this.knockback.tick(deltaFrame);
    this.expPick.tick(deltaFrame);
    this.attacks.forEach((attack) => {
      attack.tick(deltaFrame);
    });
  }

  getHitboxForObstacle(): CHitbox | undefined {
    return this.hitbox;
  }

  accelerate(direction: Vec2) {
    if (direction.x !== 0) {
      this.facing = direction.x > 0 ? 1 : -1;
    }

    if (getDistanceSquared(direction) > 0.01) {
      if (this.facing === 1 && !this.walkAnimRight.isActive()) {
        this.graphicContainer.angle = 0;
        this.walkAnimRight.invalidate().restart();
        this.walkAnimLeft.pause();
      } else if (this.facing === -1 && !this.walkAnimLeft.isActive()) {
        this.graphicContainer.angle = 0;
        this.walkAnimRight.pause();
        this.walkAnimLeft.invalidate().restart();
      }
    }

    this.movement.accelerate(direction);
  }

  upgrade(upgrade: Upgrade) {
    switch (upgrade.id) {
      case "heal":
        this.health.heal(applyExHeal(this.health.maxHealth));
        break;
      case "attract":
        this.hitboxForExp.collisions = [
          { position: { x: 0, y: 0 }, radius: this.hitboxForExp.collisions[0].radius * 1.5 },
        ];
        break;
      case "gravity_bullet":
        this.gravityBullet = true;
        break;
      case "tama":
        this.attacks.push(new CAttackTama(this.app, this.container));
        break;
      case "tama+":
        this.attacks.find((attack) => attack instanceof CAttackTama)!.level += 1;
        break;
      case "uzu":
        this.attacks.push(new CAttackUzu(this.app, this.container));
        break;
      case "uzu+":
        this.attacks.find((attack) => attack instanceof CAttackUzu)!.level += 1;
        break;
      case "nen":
        this.attacks.push(new CAttackNen(this.app, this.container));
        break;
      case "nen+":
        this.attacks.find((attack) => attack instanceof CAttackNen)!.level += 1;
        break;
      case "nami":
        this.attacks.push(new CAttackNami(this.app, this.container));
        break;
      case "nami+":
        this.attacks.find((attack) => attack instanceof CAttackNami)!.level += 1;
        break;
      case "tsubu":
        this.attacks.push(new CAttackTsubu(this.app, this.container));
        break;
      case "tsubu+":
        this.attacks.find((attack) => attack instanceof CAttackTsubu)!.level += 1;
        break;
    }

    this.upgrades.push(upgrade);
    this.eventStatusChange.trigger();
  }
}
