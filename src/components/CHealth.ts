import { EventTrigger } from "../utils/EventTrigger";

export class CHealth {
  maxHealth: number;
  currentHealth: number;
  eventDeath: EventTrigger<void> = new EventTrigger();
  eventDamage: EventTrigger<number> = new EventTrigger();
  eventChange: EventTrigger<void> = new EventTrigger();

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  init(maxHealth?: number) {
    if (maxHealth) this.maxHealth = maxHealth;
    this.currentHealth = this.maxHealth;
    this.eventChange.trigger();
  }

  takeDamage(damage: number) {
    if (!this.isAlive()) return;

    this.currentHealth = Math.max(0, this.currentHealth - damage);
    this.eventDamage.trigger(damage);
    this.eventChange.trigger();
    if (!this.isAlive()) {
      this.eventDeath.trigger();
    }
  }

  heal(healAmount: number) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + healAmount);
    this.eventChange.trigger();
  }

  isAlive(): boolean {
    return this.currentHealth > 0;
  }
}
