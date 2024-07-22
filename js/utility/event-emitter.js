class EventEmitter {
  constructor() {
    this._listenerMap = new Map();
  }

  on(eventName, listener) {
    let listeners = this._listenerMap.get(eventName);
    if (typeof listeners === 'undefined') {
      listeners = []
      this._listenerMap.set(eventName, listeners);
    }
    listeners.push(listener);
  }

  off(eventName, listener) {
    const listeners = this._listenerMap.get(eventName);
    if (typeof listeners === 'undefined') { return false; }
    const index = listeners.indexOf(listener);
    if (index < 0) { return false; }
    listeners.splice(index, 1);
    if (listeners.length === 0) {
      this._listenerMap.delete(eventName);
    }
    return true;
  }

  emit(eventName, ...args) {
    const listeners = this._listenerMap.get(eventName);
    if (typeof listeners === 'undefined') { return; }
    for (const listener of listeners) {
      listener(...args);
    }
  }

  listenerCount(eventName) {
    const listeners = this._listenerMap.get(eventName);
    return typeof listeners !== 'undefined' ? listeners.length : 0;
  }
}
