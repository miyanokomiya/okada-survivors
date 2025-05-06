export const ASCENZTION_ITEMS = [
  { ascension: 1, description: "被ダメージ +1" },
  { ascension: 2, description: "敵体力 +1" },
  { ascension: 3, description: "ピック範囲 x0.95" },
  { ascension: 4, description: "移動速度 x0.95" },
  { ascension: 5, description: "EXP x0.95" },
  { ascension: 6, description: "被ダメージ +1" },
  { ascension: 7, description: "敵体力 +1" },
  { ascension: 8, description: "ピック範囲 x0.95" },
  { ascension: 9, description: "移動速度 x0.95" },
  { ascension: 10, description: "EXP x0.95" },
  { ascension: 11, description: "被ダメージ +1" },
  { ascension: 12, description: "敵体力 +1" },
  { ascension: 13, description: "ピック範囲 x0.95" },
  { ascension: 14, description: "移動速度 x0.95" },
  { ascension: 15, description: "EXP x0.95" },
  { ascension: 16, description: "被ダメージ +1" },
  { ascension: 17, description: "敵体力 +1" },
  { ascension: 18, description: "ピック範囲 x0.95" },
  { ascension: 19, description: "移動速度 x0.95" },
  { ascension: 20, description: "EXP x0.95" },
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
  if (ascension.has(11)) {
    val += 1;
  }
  if (ascension.has(16)) {
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
  if (ascension.has(12)) {
    val += 1;
  }
  if (ascension.has(17)) {
    val += 1;
  }
  return val;
}

export function applyExPickRange(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(3)) {
    val *= 0.95;
  }
  if (ascension.has(8)) {
    val *= 0.95;
  }
  if (ascension.has(13)) {
    val *= 0.95;
  }
  if (ascension.has(18)) {
    val *= 0.95;
  }
  return val;
}

export function applyExPlayerSpeed(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(4)) {
    val *= 0.95;
  }
  if (ascension.has(9)) {
    val *= 0.95;
  }
  if (ascension.has(14)) {
    val *= 0.95;
  }
  if (ascension.has(19)) {
    val *= 0.95;
  }
  return val;
}

export function applyExExp(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(5)) {
    val *= 0.95;
  }
  if (ascension.has(10)) {
    val *= 0.95;
  }
  if (ascension.has(15)) {
    val *= 0.95;
  }
  if (ascension.has(20)) {
    val *= 0.95;
  }
  return val;
}
