import { EventTrigger } from "../utils/EventTrigger";

export class CExpLevel {
  exp = 0;
  level = 1;
  nextExp = 3;
  eventLevelup = new EventTrigger<number>();
  eventExpChange = new EventTrigger<void>();

  addExp(value: number) {
    this.exp += value;
    this.checkLevelUp();
    this.eventExpChange.trigger();
  }

  checkLevelUp() {
    if (this.exp >= this.nextExp) {
      this.level++;
      this.exp -= this.nextExp;
      this.nextExp = this.nextExp * 1.2;
      this.eventLevelup.trigger(this.level);
      this.checkLevelUp();
    }
  }

  getExpPercent() {
    return this.exp / this.nextExp;
  }
}
