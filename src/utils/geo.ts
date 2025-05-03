export type Vec2 = { x: number; y: number };

export function getUnitVec(v: Vec2, from: Vec2 = { x: 0, y: 0 }): Vec2 {
  const dx = v.x - from.x;
  const dy = v.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  return length === 0 ? { x: 1, y: 0 } : { x: dx / length, y: dy / length };
}

export function addVec(v1: Vec2, v2: Vec2): Vec2 {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

export function subVec(v1: Vec2, v2: Vec2): Vec2 {
  return { x: v1.x - v2.x, y: v1.y - v2.y };
}

export function scaleVec(v: Vec2, scalar: number): Vec2 {
  return { x: v.x * scalar, y: v.y * scalar };
}

export function getDistance(v1: Vec2, v2: Vec2 = { x: 0, y: 0 }): number {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function getDistanceSquared(v1: Vec2, v2: Vec2 = { x: 0, y: 0 }): number {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  return dx * dx + dy * dy;
}

export function lerpVec(v1: Vec2, v2: Vec2, t: number): Vec2 {
  return {
    x: v1.x + (v2.x - v1.x) * t,
    y: v1.y + (v2.y - v1.y) * t,
  };
}

export function clampVec(v: Vec2, min: Vec2, max: Vec2): Vec2 {
  return {
    x: Math.max(min.x, Math.min(max.x, v.x)),
    y: Math.max(min.y, Math.min(max.y, v.y)),
  };
}

export function getRadian(v: Vec2): number {
  return Math.atan2(v.y, v.x);
}

export function rotateVec(v: Vec2, angle: number, point: Vec2 = { x: 0, y: 0 }): Vec2 {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = v.x - point.x;
  const dy = v.y - point.y;
  return {
    x: point.x + dx * cos - dy * sin,
    y: point.y + dx * sin + dy * cos,
  };
}

export function pickMinItem<T>(arr: T[], getValue: (item: T) => number): [T, value: number] | undefined {
  if (arr.length === 0) return undefined;
  let minItem = arr[0];
  let minValue = getValue(minItem);
  for (const item of arr) {
    const value = getValue(item);
    if (value < minValue) {
      minItem = item;
      minValue = value;
    }
  }
  return [minItem, minValue];
}
