import { EnemyTeki } from "./entities/enemies/EnemyTeki";
import { Player } from "./entities/Player";
import "./style.css";
import { Application, Container, Ticker } from "pixi.js";

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
  const player = new Player(app);
  player.container.x = app.screen.width / 2;
  player.container.y = app.screen.height / 2;
  player.spawn();

  const enemies = [new EnemyTeki(app), new EnemyTeki(app), new EnemyTeki(app)];
  enemies.forEach((enemy) => {
    enemy.container.x = app.screen.width * Math.random();
    enemy.container.x = app.screen.width * Math.random();
    enemy.spawn();
  });

  function onTick(time: Ticker) {
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
    player.movement.accelerate(movement);
    player.tick(time.deltaTime);

    enemies.forEach((enemy) => {
      enemy.moveTo(player.container.position);
      enemy.tick(time.deltaTime);

      if (enemy.hitbox.check(player.hitbox)) {
        player.health.takeDamage(1);
      }
    });
    if (!player.health.isAlive()) {
      restart();
    }
  }

  function restart() {
    app.ticker.remove(onTick);
    app.stage.destroy();
    app.stage = new Container();
    initGame(app);
  }

  app.ticker.add(onTick);
}
