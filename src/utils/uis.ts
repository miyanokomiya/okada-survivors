import gsap from "gsap";
import { Container, Graphics, Text } from "pixi.js";

export function createTextButton(text: string, width: number, height: number, fontSize = 36): Container {
  const wrapper = new Container();
  const button = new Container();
  button.pivot.set(width / 2, height / 2);
  button.position.set(width / 2, height / 2);
  wrapper.addChild(button);

  const outline = new Graphics().roundRect(0, 0, width, height, 5).fill(0xaaaaaa).stroke({ color: 0x000000, width: 2 });
  button.addChild(outline);

  const nameText = new Text({
    text,
    style: { fontSize, fill: 0x000000, fontWeight: "400" },
  });
  nameText.anchor.set(0.5);
  nameText.x = outline.width / 2;
  nameText.y = outline.height / 2;
  button.addChild(nameText);

  wrapper.on("pointerenter", () => {
    gsap.to(button.scale, {
      x: 1.05,
      y: 1.05,
      duration: 0.05,
    });
  });
  wrapper.on("pointerleave", () => {
    gsap.to(button.scale, {
      x: 1,
      y: 1,
      duration: 0.05,
    });
  });

  return wrapper;
}
