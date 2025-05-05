export class WeightedTable<T> {
  private items: { item: T; weight: number }[] = [];

  constructor() {}

  private getTotalWeight(): number {
    return this.items.reduce((sum, { weight }) => sum + weight, 0);
  }

  add(item: T, weight: number) {
    this.items.push({ item, weight });
  }

  remove(item: T) {
    this.items = this.items.filter(({ item: i }) => i !== item);
  }

  getSize(): number {
    return this.items.length;
  }

  getAll(): T[] {
    return this.items.map(({ item }) => item);
  }

  getRandomItem(): T | undefined {
    const totalWeight = this.getTotalWeight();
    if (totalWeight === 0) return undefined;

    const randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const { item, weight } of this.items) {
      cumulativeWeight += weight;
      if (randomValue < cumulativeWeight) {
        return item;
      }
    }
  }
}

export function createWeightedTable<T>(items: { item: T; weight: number }[]): WeightedTable<T> {
  const table = new WeightedTable<T>();
  for (const { item, weight } of items) {
    table.add(item, weight);
  }
  return table;
}
