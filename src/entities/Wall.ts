import { CHitbox } from "../components/CHitbox.ts";
import { Entity, getEntity } from "./Entity";
import { Application, Graphics } from "pixi.js";
import {
  getEnemyContaienr,
  getItemContaienr,
  getPlayerContaienr,
  getProjectileContaienr,
  getProjectileContainerBack,
} from "../utils/containers.ts";
import { isExWallImpervious } from "../utils/globalSettings.ts";
import { Projectile } from "./projectiles/Projectile.ts";

export class Wall extends Entity {
  hitbox: CHitbox;
  private radius = 10;
  private graphics = new Graphics();

  constructor(app: Application, radius: number = 10) {
    super(app);

    this.container.label = "wall";
    this.container.addChild(this.graphics);
    this.hitbox = new CHitbox(this.container);
    this.hitbox.cooltimeForSameTarget = 0;

    this.setRadius(radius);
  }

  setRadius(radius: number) {
    this.radius = radius;
    this.graphics.clear().circle(0, 0, radius).fill(0x666666).stroke({ color: 0x000000, width: 2 });
    this.hitbox.collisions = [{ position: { x: 0, y: 0 }, radius: radius }];
  }

  getRadius() {
    return this.radius;
  }

  pushOut(entity: Entity) {
    const hitbox = entity.getHitboxForObstacle();
    if (!hitbox) return;

    if (this.hitbox.check(hitbox)) {
      const dx = entity.container.x - this.container.x;
      const dy = entity.container.y - this.container.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const combinedRadius = this.hitbox.collisions[0].radius + hitbox.collisions[0].radius;

      // Push the entity out of the wall
      const overlap = combinedRadius - distance;
      const pushX = (dx / distance) * overlap;
      const pushY = (dy / distance) * overlap;
      entity.container.x += pushX;
      entity.container.y += pushY;
    }
  }

  tick() {
    const margin = this.radius * 1.5;
    if (
      !this.isInCamera({
        x: this.container.x - margin,
        y: this.container.y - margin,
        width: margin * 2,
        height: margin * 2,
      })
    )
      return;

    const enemies = (getEnemyContaienr(this.app)?.children ?? []).map((child) => getEntity(child));
    enemies.forEach((enemy) => {
      this.pushOut(enemy);
    });

    const items = (getItemContaienr(this.app)?.children ?? []).map((child) => getEntity(child));
    items.forEach((item) => {
      this.pushOut(item);
    });

    const playerContainer = getPlayerContaienr(this.app)!.children.find((child) => child.label === "player")!;
    this.pushOut(getEntity(playerContainer));

    if (isExWallImpervious()) {
      const projectiles = (getProjectileContaienr(this.app)?.children ?? []).concat(
        getProjectileContainerBack(this.app)?.children ?? [],
      );
      projectiles
        .map((child) => getEntity<Projectile>(child))
        .forEach((item) => {
          if (item.dencity < 12 && this.hitbox.check(item.hitbox)) {
            item.dispose = true;
          }
        });
    }
  }
}
