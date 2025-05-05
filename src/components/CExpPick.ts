import { Application, Container } from "pixi.js";
import { ExpGem } from "../entities/ExpGem";
import { getItemContaienr } from "../utils/containers";
import { CHitbox } from "./CHitbox";
import { getEntity } from "../entities/Entity";

export class CExpPick {
  constructor(
    public app: Application,
    public parent: Container,
    public hitbox: CHitbox,
  ) {}

  tick(_deltaFrame: number) {
    const gems = getItemContaienr(this.app)?.children.filter((child) => child.label === "exp-gem") ?? [];
    for (const gem of gems) {
      const gemEntty = getEntity<ExpGem>(gem);
      if (!gemEntty.attracting && this.hitbox.check(gemEntty.hurtbox)) {
        gemEntty.attract(this.parent);
      }
    }
  }
}
