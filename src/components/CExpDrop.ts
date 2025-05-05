import { Application } from "pixi.js";
import { ExpGem } from "../entities/ExpGem";
import { getItemContaienr } from "../utils/containers";
import { Vec2 } from "../utils/geo";

export class CExpDrop {
  constructor(
    public app: Application,
    public rate: number,
  ) {}

  tryDrop(p: Vec2) {
    if (Math.random() > this.rate) return;

    const gem = new ExpGem(this.app);
    gem.container.x = p.x;
    gem.container.y = p.y;
    gem.spawn(getItemContaienr(this.app));
  }
}
