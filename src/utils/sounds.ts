import { sound } from "@pixi/sound";
import { isPageActive } from "./pageState";
import maou_se_battle14 from "../assets/maou_se_battle14.mp3";
import maou_se_battle15 from "../assets/maou_se_battle15.mp3";
import maou_se_battle16 from "../assets/maou_se_battle16.mp3";
import maou_se_system48 from "../assets/maou_se_system48.mp3";

const src = {
  hit1: { url: maou_se_battle14, volume: 0.2 },
  hit2: { url: maou_se_battle15, volume: 0.2 },
  hit3: { url: maou_se_battle16, volume: 0.2 },
  pick1: { url: maou_se_system48, volume: 0.2 },
};

export function playSound(name: keyof typeof src) {
  if (!isPageActive()) return;
  sound.play(name);
}

export function initSounds() {
  for (const [name, info] of Object.entries(src)) {
    sound.add(name, { ...info, preload: true });
  }
}
