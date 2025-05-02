import { Player } from "./entities/Player";
import "./style.css";
import { Application } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", width: 800, height: 600 });
  const appElm = document.getElementById("app")!;
  appElm.appendChild(app.canvas);

  const player = new Player(app);
  player.container.x = 0; // app.screen.width / 2;
  player.container.y = app.screen.height / 2;
  player.spawn();

  app.ticker.add((time) => {
    player.tick(time.deltaTime);
  });
})();
