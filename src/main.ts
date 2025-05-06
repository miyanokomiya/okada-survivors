import { MainScene } from "./scenes/MainScene";
import "./style.css";
import { Application, Assets } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import background from "./assets/background.svg";
import star10 from "./assets/star10.svg";
import { initSounds } from "./utils/sounds";

const keyState: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  delete keyState[e.key];
});

(async () => {
  initSounds();
  await Assets.load([background, star10]);

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
