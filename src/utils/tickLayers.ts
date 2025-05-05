import { Application } from "pixi.js";

export const LAYER_MAIN = Symbol("LAYER_MAIN");
export const LAYER_OVERLAY = Symbol("LAYER_OVERLAY");

export function initTickLayers(app: Application) {
  (app as any)[LAYER_MAIN] = 0;
  (app as any)[LAYER_OVERLAY] = 0;
}

export function isPausedLayerMain(app: Application): boolean {
  return (app as any)[LAYER_MAIN] > 0;
}

export function pauseLayerMain(app: Application) {
  (app as any)[LAYER_MAIN] += 1;
}

export function resumeLayerMain(app: Application) {
  (app as any)[LAYER_MAIN] = Math.max(0, (app as any)[LAYER_MAIN] - 1);
}
