export class CHealth {
  maxHealth: number;
  currentHealth: number;
  onDeath: () => void = () => {};

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
  }

  init(maxHealth?: number) {
    if (maxHealth) this.maxHealth = maxHealth;
    this.currentHealth = this.maxHealth;
  }

  takeDamage(damage: number) {
    if (!this.isAlive()) return;

    this.currentHealth = Math.max(0, this.currentHealth - damage);
    if (!this.isAlive()) {
      this.onDeath();
    }
  }

  heal(healAmount: number) {
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + healAmount);
  }

  isAlive(): boolean {
    return this.currentHealth > 0;
  }
}
