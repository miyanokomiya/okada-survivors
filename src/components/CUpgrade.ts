import { Application } from "pixi.js";
import { createWeightedTable, WeightedTable } from "../utils/WeightedTable";
import { Upgrade } from "../utils/upgrades";
import { EventTrigger } from "../utils/EventTrigger";
import { applyExHeal, getExLoserOption } from "../utils/globalSettings";

export class CUpgrade {
  table: WeightedTable<Upgrade>;
  upgraded: Set<Upgrade> = new Set();
  eventUpgradeSelected: EventTrigger<Upgrade> = new EventTrigger();

  constructor(public app: Application) {
    const loserWeight = getExLoserOption();
    this.table = createWeightedTable([
      ...(loserWeight === 0
        ? []
        : [
            {
              item: {
                id: "loser",
                name: "ハズレ",
                description: "何も起こらない",
                count: Infinity,
              },
              weight: loserWeight,
            },
          ]),
      {
        item: {
          id: "heal",
          name: "回復",
          description: `体力を${Math.round(applyExHeal(80))}%回復する`,
          count: Infinity,
        },
        weight: 0.5,
      },
      {
        item: {
          id: "attract",
          name: "引き寄せ+1",
          description: "より遠くのアイテムを引き寄せる",
          children: [
            {
              id: "attract",
              name: "引き寄せ+2",
              description: "より遠くのアイテムを引き寄せる",
              weight: 0.5,
              children: [
                {
                  id: "attract",
                  name: "引き寄せ+3",
                  description: "より遠くのアイテムを引き寄せる",
                  weight: 0.5,
                  children: [
                    {
                      id: "gravity_bullet",
                      name: "引力付与",
                      description: "攻撃がアイテムを引き寄せる",
                      weight: 0.5,
                    },
                  ],
                },
              ],
            },
          ],
        },
        weight: 0.5,
      },
      {
        item: {
          id: "uzu",
          name: "渦",
          description: "プレイヤーの周囲を渦状に移動する弾を発射する",
          initial: true,
          children: [
            {
              id: "uzu+",
              name: "渦+1",
              description: "渦数: +1",
              weight: 1,
              children: [
                {
                  id: "uzu+",
                  name: "渦+2",
                  description: "渦数: +1\n弾強度: 2",
                  weight: 1,
                  children: [
                    {
                      id: "uzu+",
                      name: "渦+3",
                      description: "渦数: +2",
                      weight: 1,
                      children: [
                        {
                          id: "uzu+",
                          name: "渦+4",
                          description: "貫通効果を付与する",
                          weight: 0.7,
                          children: [
                            {
                              id: "uzu+",
                              name: "渦+5",
                              description: "渦数倍増",
                              weight: 0.5,
                              children: [
                                {
                                  id: "uzu+",
                                  name: "渦++",
                                  description: "渦数: +1",
                                  weight: 0.5,
                                  count: Infinity,
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
          ],
        },
        weight: 1,
      },
      {
        item: {
          id: "nen",
          name: "熱",
          description: "継続ダメージを与える熱源をプレイヤーの周囲にランダムで生成する\n弾強度: 貫通",
          initial: true,
          children: [
            {
              id: "nen+",
              name: "熱++",
              description: "熱源数: +1",
              weight: 0.5,
              children: [
                {
                  id: "nen+",
                  name: "熱++",
                  description: "熱源数: +1",
                  weight: 0.5,
                },
              ],
            },
          ],
        },
        weight: 1,
      },
      {
        item: {
          id: "nami",
          name: "波",
          description: "敵に向けて波状に移動する弾を発射する\n初回ヒット時に新たな波を跳ね返す",
          initial: true,
          children: [
            {
              id: "nami+",
              name: "波+1",
              description: "波数: +1",
              weight: 1,
              children: [
                {
                  id: "nami+",
                  name: "波+2",
                  description: "波数: +1\n弾強度: +1",
                  weight: 1,
                  children: [
                    {
                      id: "nami+",
                      name: "波+3",
                      description: "波数: +2",
                      weight: 1,
                      children: [
                        {
                          id: "nami+",
                          name: "波+4",
                          description: "貫通効果を付与する",
                          weight: 0.7,
                          children: [
                            {
                              id: "nami+",
                              name: "波+5",
                              description: "波数倍増",
                              weight: 0.5,
                              children: [
                                {
                                  id: "nami+",
                                  name: "波++",
                                  description: "波数: +1",
                                  weight: 0.5,
                                  count: Infinity,
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
          ],
        },
        weight: 1,
      },
      {
        item: {
          id: "tsubu",
          name: "粒",
          initial: true,
          description: "敵に向けて粒を連射する",
          children: [
            {
              id: "tsubu+",
              name: "粒+1",
              description: "粒数: +2",
              weight: 1,
              children: [
                {
                  id: "tsubu+",
                  name: "粒+2",
                  description: "粒数: +2\n弾強度: +1",
                  weight: 1,
                  children: [
                    {
                      id: "tsubu+",
                      name: "粒+3",
                      description: "粒数: +4",
                      weight: 1,
                      children: [
                        {
                          id: "tsubu+",
                          name: "粒+4",
                          description: "貫通効果を付与する",
                          weight: 0.7,
                          children: [
                            {
                              id: "tsubu+",
                              name: "粒+5",
                              description: "粒数倍増",
                              weight: 0.5,
                              children: [
                                {
                                  id: "tsubu+",
                                  name: "粒++",
                                  description: "粒数: +2",
                                  weight: 0.5,
                                  count: Infinity,
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
          ],
        },
        weight: 1,
      },
      {
        weight: 1,
        item: {
          id: "tama",
          name: "弾",
          description: "敵に向けて弾を発射する",
          initial: true,
          children: [
            {
              id: "tama+",
              name: "弾+1",
              description: "弾数: +1",
              weight: 1,
              children: [
                {
                  id: "tama+",
                  name: "弾+2",
                  description: "弾数: +1\n弾強度: +1",
                  weight: 1,
                  children: [
                    {
                      id: "tama+",
                      name: "弾+3",
                      description: "弾数: +2",
                      weight: 1,
                      children: [
                        {
                          id: "tama+",
                          name: "弾+4",
                          description: "貫通効果を付与する",
                          weight: 0.7,
                          children: [
                            {
                              id: "tama+",
                              name: "弾+5",
                              description: "弾数倍増",
                              weight: 0.5,
                              children: [
                                {
                                  id: "tama+",
                                  name: "弾++",
                                  description: "弾数: +1",
                                  weight: 0.5,
                                  count: Infinity,
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
          ],
        },
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

  getInitialOptions(): Upgrade[] {
    const initialItems = this.table.getAll().filter((item) => item.initial);
    if (initialItems.length <= 3) {
      return initialItems;
    }

    const ret: Set<Upgrade> = new Set();
    while (ret.size < 3) {
      const item = this.table.getRandomItem();
      if (!item) break;
      if (!item.initial) continue;
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
    } else {
      upgrade.children?.forEach((child) => {
        this.table.add(child, child.weight ?? 1);
      });
    }

    this.eventUpgradeSelected.trigger(upgrade);
  }

  removeOption(upgrade: Upgrade) {
    this.table.remove(upgrade);
  }
}
