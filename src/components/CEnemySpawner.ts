import { Application } from "pixi.js";
import { CTimer } from "./CTimer";
import { WeightedTable } from "../utils/WeightedTable";
import { Enemy } from "../entities/enemies/Enemy";
import { getEnemyContaienr, getPlayerContaienr } from "../utils/containers";
import { Player } from "../entities/Player";
import { getEntity } from "../entities/Entity";
import { getDistance } from "../utils/geo";

type EnemyConstructor = new (...args: any[]) => Enemy;

export class CEnemySpawner {
  private spawnTimer: CTimer;
  private baseSpawnInterval = 60 * 2;
  private player: Player;
  level = 1;

  constructor(
    public app: Application,
    public enemyTables: [level: number, WeightedTable<EnemyConstructor>][],
  ) {
    this.spawnTimer = new CTimer(this.baseSpawnInterval);
    this.spawnTimer.loop = true;
    this.spawnTimer.onFinish = () => {
      this.spawnEnemy();
    };
    this.spawnTimer.start();

    const playerContainer = getPlayerContaienr(this.app)!.children.find((child) => child.label === "player")!;
    this.player = getEntity<Player>(playerContainer);
  }

  tick(deltaFrame: number) {
    if (this.spawnTimer.isRunning) {
      this.spawnTimer.tick(deltaFrame);
    }
  }

  setLevel(level: number) {
    if (this.level === level) return;

    this.level = level;

    this.spawnTimer.duration = Math.max(1, this.baseSpawnInterval * Math.pow(0.825, this.level));
    this.spawnTimer.start();
  }

  private spawnEnemy() {
    const tableIndex = this.enemyTables.findIndex((table) => table[0] > this.level);
    const table = this.enemyTables[tableIndex - 1] ?? this.enemyTables[0];
    if (!table) return;

    const Item = table[1].getRandomItem();
    if (!Item) return;

    const enemy = new Item(this.app);
    const distance = getDistance({ x: this.app.screen.width / 2, y: this.app.screen.height / 2 });
    const angle = Math.random() * Math.PI * 2;
    enemy.container.x = this.player.container.x + Math.cos(angle) * distance;
    enemy.container.y = this.player.container.y + Math.sin(angle) * distance;
    enemy.spawn(getEnemyContaienr(this.app));
  }
}
