import { MainScene } from "./scenes/MainScene";
import "./style.css";
import { Application } from "pixi.js";

const keyState: Record<string, boolean> = {};
window.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
});
window.addEventListener("keyup", (e) => {
  delete keyState[e.key];
});

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", width: 800, height: 600 });
  const appElm = document.getElementById("app")!;
  appElm.appendChild(app.canvas);
  initGame(app);
})();

function initGame(app: Application) {
  new MainScene(app);
}
