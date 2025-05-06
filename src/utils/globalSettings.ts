export const ASCENZTION_ITEMS = [
  { ascension: 1, description: "被ダメージ +1" },
  { ascension: 2, description: "敵体力 +1" },
  { ascension: 3, description: "ピック範囲 x0.95" },
  { ascension: 4, description: "EXP x0.95" },
  { ascension: 5, description: "Lv上限 +3" },
  { ascension: 6, description: "移動速度 x0.95" },
  { ascension: 7, description: "攻撃持続 x0.95" },
  { ascension: 8, description: "攻撃速度 x0.95" },
  { ascension: 9, description: "強敵出現率 x1.2" },
  { ascension: 10, description: "敵ノックバック x0.5" },
  { ascension: 11, description: "被ダメージ +1" },
  { ascension: 12, description: "貫通上限 10" },
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
  if (ascension.has(11)) {
    val += 1;
  }
  return val;
}

export function applyExEnemyHealth(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(2)) {
    val += 1;
  }
  return val;
}

export function applyExPickRange(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(3)) {
    val *= 0.95;
  }
  return val;
}

export function applyExPlayerSpeed(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(6)) {
    val *= 0.95;
  }
  return val;
}

export function applyExExp(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(4)) {
    val *= 0.95;
  }
  return val;
}

export function applyExMaxLevel(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(5)) {
    val += 3;
  }
  return val;
}

export function applyExAttackDuration(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(7)) {
    val *= 0.95;
  }
  return val;
}

export function applyExAttackCooldown(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(8)) {
    val *= 1 / 0.95;
  }
  return val;
}

export function applyExWeakPoolRate(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(9)) {
    val *= 1 / 1.2;
  }
  return val;
}

export function applyExMaxDencity(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(12)) {
    val = Math.min(10, val);
  }
  return val;
}

export function applyExKnockback(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(10)) {
    val *= 0.5;
  }
  return val;
}
