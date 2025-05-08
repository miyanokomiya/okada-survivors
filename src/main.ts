import "./style.css";
import { Application, Assets } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import background from "./assets/background.svg";
import star10 from "./assets/star10.svg";
import { initSounds } from "./utils/sounds";
import { TitleScene } from "./scenes/TitleScene";

async function init() {
  initSounds();
  await Assets.load([background, star10]);

  const appElm = document.getElementById("app")!;
  const app = new Application();
  await app.init({ background: "#1099bb", resizeTo: appElm });
  gsap.registerPlugin(PixiPlugin);
  PixiPlugin.registerPIXI(app);
  appElm.appendChild(app.canvas);
  initGame(app);
}
init();

function initGame(app: Application) {
  new TitleScene(app);
}
