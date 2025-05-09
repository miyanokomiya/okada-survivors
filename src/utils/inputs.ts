import { Vec2 } from "./geo";

export function getDirectionalMovement(keyState: Record<string, any>): Vec2 {
  const movement = { x: 0, y: 0 };
  if (keyState["ArrowUp"] || keyState["w"]) {
    movement.y -= 1;
  }
  if (keyState["ArrowDown"] || keyState["s"]) {
    movement.y += 1;
  }
  if (keyState["ArrowLeft"] || keyState["a"]) {
    movement.x -= 1;
  }
  if (keyState["ArrowRight"] || keyState["d"]) {
    movement.x += 1;
  }
  return movement;
}

export function getSubmitInput(keyState: Record<string, any>): boolean {
  return keyState["Enter"] || keyState[" "];
}

export function getPauseInput(keyState: Record<string, any>): boolean {
  return keyState["q"] || keyState["Escape"];
}

export function getTurboInput(keyState: Record<string, any>): boolean {
  return keyState["o"];
}