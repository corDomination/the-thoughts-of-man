class EventListenerGroup {
  constructor() {
    this._listeners = [];
  }

  get length() { return this._listeners.length; }

  on(target, event, callback, ...args) {
    target.on(event, callback, ...args)
    this._listeners.push({ type: 'on', target, event, callback });
  }

  addEventListener(target, event, callback, ...args) {
    target.addEventListener(event, callback, ...args);
    this._listeners.push({ type: 'addEventListener', target, event, callback });
  }

  clear() {
    if (this._listeners.length === 0) { return; }
    for (const listener of this._listeners) {
      switch (listener.type) {
        case 'on':
          listener.target.off(listener.event, listener.callback);
          break;
        case 'addEventListener':
          listener.target.removeEventListener(listener.event, listener.callback);
          break;
        default:
          console.log('Removing invalid listener')
      }
    }
    this._listeners.length = 0;
  }
}
