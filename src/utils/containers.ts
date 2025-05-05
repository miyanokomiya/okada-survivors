import { Application, Container } from "pixi.js";

export function initContainers(app: Application) {
  const cameraContainer = new Container();
  cameraContainer.label = "camera_container";

  const backgroundContainer = new Container();
  backgroundContainer.label = "background_container";
  const projectileContainerBack = new Container();
  projectileContainerBack.label = "projectile_container_back";
  const playerContainer = new Container();
  playerContainer.label = "player_container";
  const itemContainer = new Container();
  itemContainer.label = "item_container";
  const enemyContainer = new Container();
  enemyContainer.label = "enemy_container";
  const projectileContainer = new Container();
  projectileContainer.label = "projectile_container";
  const widgetContainer = new Container();
  widgetContainer.label = "widget_container";

  app.stage.addChild(backgroundContainer);

  cameraContainer.addChild(projectileContainerBack);
  cameraContainer.addChild(playerContainer);
  cameraContainer.addChild(itemContainer);
  cameraContainer.addChild(enemyContainer);
  cameraContainer.addChild(projectileContainer);
  cameraContainer.addChild(widgetContainer);
  app.stage.addChild(cameraContainer);

  const hudContainer = new Container();
  hudContainer.label = "hud_container";
  app.stage.addChild(hudContainer);
}

export function getBackgroundContainer(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "background_container");
}

export function getCameraContainer(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "camera_container");
}

export function getProjectileContainerBack(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "projectile_container_back");
}

export function getPlayerContaienr(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "player_container");
}

export function getItemContaienr(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "item_container");
}

export function getEnemyContaienr(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "enemy_container");
}

export function getProjectileContaienr(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "projectile_container");
}

export function getWidgetContaienr(app: Application): Container | undefined {
  return getCameraContainer(app)?.children.find((child) => child.label === "widget_container");
}

export function getHudContaienr(app: Application): Container | undefined {
  return app.stage.children.find((child) => child.label === "hud_container");
}
