import { Application } from "pixi.js";
import { createWeightedTable, WeightedTable } from "../utils/WeightedTable";
import { Upgrade } from "../utils/upgrades";
import { EventTrigger } from "../utils/EventTrigger";

export class CUpgrade {
  table: WeightedTable<Upgrade>;
  upgraded: Set<Upgrade> = new Set();
  eventUpgradeSelected: EventTrigger<Upgrade> = new EventTrigger();

  constructor(public app: Application) {
    this.table = createWeightedTable([
      {
        item: {
          id: "heal",
          name: "回復",
          description: "体力を最大まで回復する",
          count: Infinity,
        },
        weight: 0.5,
      },
      {
        item: {
          id: "attract",
          name: "引き寄せ+",
          description: "より遠くのアイテムを引き寄せる",
          count: 3,
        },
        weight: 0.5,
      },
      {
        item: {
          id: "uzu",
          name: "渦",
          description: "プレイヤーの周囲を渦状に移動する弾を生成する",
          children: [
            {
              id: "uzu+",
              name: "渦+1",
              description: "さらなる渦を生成する",
              weight: 1,
              children: [
                {
                  id: "uzu+",
                  name: "渦+2",
                  description: "さらなる渦を生成する",
                  weight: 1,
                  children: [
                    {
                      id: "uzu+",
                      name: "渦+3",
                      description: "さらなる渦を生成する",
                      weight: 1,
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        weight: 1,
      },
      {
        item: {
          id: "nen",
          name: "熱",
          description: "継続ダメージを与える熱源をプレイヤーの周囲にランダムで生成する",
          children: [
            {
              id: "nen+",
              name: "熱+1",
              description: "さらなる熱源を生成する",
              weight: 1,
            },
          ],
        },
        weight: 1,
      },
      {
        item: {
          id: "nami",
          name: "波",
          description: "敵に向けて波状に移動する弾を生成する",
          children: [
            {
              id: "nami+",
              name: "波+1",
              description: "さらなる波を生成する",
              weight: 1,
              children: [
                {
                  id: "nami+",
                  name: "波+2",
                  description: "さらなる波を生成する",
                  weight: 1,
                  children: [
                    {
                      id: "nami+",
                      name: "波+3",
                      description: "さらなる波を生成する",
                      weight: 1,
                      children: [
                        {
                          id: "nami+",
                          name: "波+4",
                          description: "貫通効果を付与する",
                          weight: 1,
                          children: [
                            {
                              id: "nami+",
                              name: "波+5",
                              description: "新たな波を生成する",
                              weight: 1,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        weight: 1,
      },
    ]);
  }

  getOptions(): Upgrade[] {
    if (this.table.getSize() <= 3) {
      return this.table.getAll();
    }

    const ret: Set<Upgrade> = new Set();
    while (ret.size < 3) {
      const item = this.table.getRandomItem();
      if (!item) break;
      ret.add(item);
    }
    return Array.from(ret);
  }

  chooseOption(upgrade: Upgrade) {
    this.upgraded.add(upgrade);
    this.removeOption(upgrade);

    const nextCount = (upgrade.count ?? 1) - 1;
    if (nextCount > 0) {
      this.table.add({ ...upgrade, count: nextCount }, upgrade.weight ?? 1);
    }

    upgrade.children?.forEach((child) => {
      this.table.add(child, child.weight ?? 1);
    });

    this.eventUpgradeSelected.trigger(upgrade);
  }

  removeOption(upgrade: Upgrade) {
    this.table.remove(upgrade);
  }
}
