import { MainScene } from "./scenes/MainScene";
import "./style.css";
import { Application, Assets } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import background from "./assets/background.svg";

const keyState: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  delete keyState[e.key];
});

(async () => {
  await Assets.load([background]);

  const app = new Application();
  await app.init({ background: "#1099bb", width: 800, height: 600 });
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(app);
  const appElm = document.getElementById("app")!;
  appElm.appendChild(app.canvas);
  initGame(app);
})();

function initGame(app: Application) {
  new MainScene(app);
}
