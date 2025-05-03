import { Player } from "./entities/Player";
import "./style.css";
import { Application } from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ background: "#1099bb", width: 800, height: 600 });
  const appElm = document.getElementById("app")!;
  appElm.appendChild(app.canvas);

  const keyState: Record<string, boolean> = {};
  window.addEventListener("keydown", (e) => {
    keyState[e.key] = true;
  });
  window.addEventListener("keyup", (e) => {
    delete keyState[e.key];
  });

  const player = new Player(app);
  player.container.x = app.screen.width / 2;
  player.container.y = app.screen.height / 2;
  player.spawn();

  app.ticker.add((time) => {
    const movement = { x: 0, y: 0 }
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
    player.cmovement.accelerate(movement);
    player.tick(time.deltaTime);
  });
})();
