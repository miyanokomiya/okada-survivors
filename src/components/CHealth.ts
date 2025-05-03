export class CHealth {
  maxHealth: number;
  currentHealth: number;

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  init(maxHealth?: number) {
    if (maxHealth) this.maxHealth = maxHealth;
    this.currentHealth = this.maxHealth;
  }

  takeDamage(damage: number) {
    this.currentHealth = Math.max(0, this.currentHealth - damage);
  }

  heal(healAmount: number) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + healAmount);
  }

  isAlive(): boolean {
    return this.currentHealth > 0;
  }
}
