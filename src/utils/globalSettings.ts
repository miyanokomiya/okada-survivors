export const ASCENZTION_ITEMS = [
  { ascension: 1, description: "被ダメージ +1" },
  { ascension: 2, description: "敵体力 +1" },
  { ascension: 3, description: "ピック範囲 x0.9" },
  { ascension: 4, description: "移動速度 x0.9" },
  { ascension: 5, description: "EXP x0.9" },
  { ascension: 6, description: "被ダメージ +1" },
  { ascension: 7, description: "敵体力 +1" },
  { ascension: 8, description: "ピック範囲 x0.9" },
  { ascension: 9, description: "移動速度 x0.9" },
  { ascension: 10, description: "EXP x0.9" },
];

const activeAscensions = new Set<number>();

export function getActiveAscension() {
  return activeAscensions;
}

export function setActiveAscension(ascension: number, value: boolean) {
  if (value) {
    activeAscensions.add(ascension);
  } else {
    activeAscensions.delete(ascension);
  }
}

export function applyExDamage(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(1)) {
    val += 1;
  }
  if (ascension.has(6)) {
    val += 1;
  }
  return val;
}

export function applyExEnemyHealth(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(2)) {
    val += 1;
  }
  if (ascension.has(7)) {
    val += 1;
  }
  return val;
}

export function applyExPickRange(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(3)) {
    val *= 0.9;
  }
  if (ascension.has(8)) {
    val += 0.9;
  }
  return val;
}

export function applyExPlayerSpeed(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(4)) {
    val *= 0.9;
  }
  if (ascension.has(9)) {
    val += 0.9;
  }
  return val;
}

export function applyExExp(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(5)) {
    val *= 0.9;
  }
  if (ascension.has(10)) {
    val += 0.9;
  }
  return val;
}
