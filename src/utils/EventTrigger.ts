export class EventTrigger<T> {
  private callbacks: Set<(arg: T) => void> = new Set();

  trigger(arg: T) {
    for (const callback of this.callbacks) {
      callback(arg);
    }
  }

  add(callback: (arg: T) => void) {
    this.callbacks.add(callback);
  }

  remove(callback: (arg: T) => void) {
    this.callbacks.delete(callback);
  }

  clear() {
    this.callbacks.clear();
  }
}
