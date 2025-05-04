export class WeightedTable<T> {
  private totalWeight: number = 0;
  private items: { item: T; weight: number }[] = [];

  constructor() {}

  add(item: T, weight: number) {
    this.items.push({ item, weight });
    this.totalWeight += weight;
  }

  getRandomItem(): T | undefined {
    if (this.totalWeight === 0) return undefined;

    const randomValue = Math.random() * this.totalWeight;
    let cumulativeWeight = 0;

    for (const { item, weight } of this.items) {
      cumulativeWeight += weight;
      if (randomValue < cumulativeWeight) {
        return item;
      }
    }

    return undefined; // This should never happen if totalWeight is correct
  }
}

export function createWeightedTable<T>(items: { item: T; weight: number }[]): WeightedTable<T> {
  const table = new WeightedTable<T>();
  for (const { item, weight } of items) {
    table.add(item, weight);
  }
  return table;
}
