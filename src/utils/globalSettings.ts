export const ASCENZTION_ITEMS = [
  { ascension: 1, description: "被ダメージ +1" },
  { ascension: 2, description: "敵体力 +1" },
  { ascension: 3, description: "ピック範囲 x0.95" },
  { ascension: 4, description: "EXP x0.95" },
  { ascension: 5, description: "敵攻撃速度 x1.2" },
  { ascension: 6, description: "Lv上限 +3" },
  { ascension: 7, description: "最大体力 x0.85" },
  { ascension: 8, description: "移動速度 x0.95" },
  { ascension: 9, description: "攻撃持続 x0.95" },
  { ascension: 10, description: "攻撃速度 x0.95" },
  { ascension: 11, description: "強敵出現率 x1.2" },
  { ascension: 12, description: "敵ノックバック x0.5" },
  { ascension: 13, description: "貫通上限 12" },
  { ascension: 14, description: "長寿敵加速" },
  { ascension: 15, description: "ハズレ選択肢追加" },
  { ascension: 16, description: "障害物ランダム配置" },
  { ascension: 17, description: "障害物巨大化" },
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

export function applyExExp(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(4)) {
    val *= 0.95;
  }
  return val;
}

export function applyExEnemyAttackCooltime(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(5)) {
    val *= 1 / 1.2;
  }
  return val;
}

export function applyExMaxLevel(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(6)) {
    val += 3;
  }
  return val;
}

export function applyExPlayerHealth(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(7)) {
    val *= 0.85;
  }
  return val;
}

export function applyExPlayerSpeed(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(8)) {
    val *= 0.95;
  }
  return val;
}

export function applyExAttackDuration(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(9)) {
    val *= 0.95;
  }
  return val;
}

export function applyExAttackCooldown(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(10)) {
    val *= 1 / 0.95;
  }
  return val;
}

export function applyExWeakPoolRate(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(11)) {
    val *= 1 / 1.2;
  }
  return val;
}

export function applyExKnockback(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(12)) {
    val *= 0.5;
  }
  return val;
}

export function applyExMaxDencity(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(13)) {
    val = Math.min(12, val);
  }
  return val;
}

export function getExEnemyLimitBreak(lifetime: number): number {
  const ascension = getActiveAscension();
  let rate = 1;
  if (ascension.has(14) && 60 * 30 < lifetime) {
    rate *= 1.5;
  }
  return rate;
}

export function getExLoserOption(): number {
  const ascension = getActiveAscension();
  let rate = 0;
  if (ascension.has(15)) {
    rate = 0.5;
  }
  return rate;
}

export function isExRandomWall(): boolean {
  const ascension = getActiveAscension();
  return ascension.has(16);
}

export function applyExWallSize(val: number): number {
  const ascension = getActiveAscension();
  if (ascension.has(17)) {
    val *= 2;
  }
  return val;
}
