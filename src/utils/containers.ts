import { Application, Container } from "pixi.js";

export function initContainers(app: Application) {
  const enemyContainer = new Container();
  enemyContainer.label = "enemy_container";
  const projectileContainer = new Container();
  projectileContainer.label = "projectile_container";
  const widgetContainer = new Container();
  widgetContainer.label = "widget_container";
  app.stage.addChild(enemyContainer);
  app.stage.addChild(projectileContainer);
  app.stage.addChild(widgetContainer);
}

export function getEnemyContaienr(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "enemy_container");
}

export function getProjectileContaienr(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "projectile_container");
}

export function getWidgetContaienr(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "widget_container");
}
