class ElementVisibilityController {
  constructor(element, duration) {
    this._duration = duration;
    this._timeout = null;
    this._promiseDetails = null;
    this._element = element;
  }

  async setVisible(visible, immediate) {
    if (visible !== this._element.hidden) {
      clearTimeout(this._timeout);
      if (this._promiseDetails !== null) {
        this._promiseDetails.resolve(true);
        this._promiseDetails = null;
      }
      return false;
    }
    this._element.classList.add('visibility-animating');
    getComputedStyle(this._element).getPropertyValue('display');
    this._element.hidden = !visible;
    this._promiseDetails = PromiseUtility.createDeferredPromise();

    if (!immediate) {
      this._timeout = setTimeout(() => {
        this.resolve();
      }, this._duration);
    } else {
      this._element.classList.remove('visibility-animating');
      this._timeout = null;
      this._promiseDetails.resolve(true);
    }
    const result = await this._promiseDetails.promise;
    return result;
  }

  resolve() {
    if (this._promiseDetails !== null) {
      this._promiseDetails.resolve(true);
      this._promiseDetails = null;
      this._timeout = null;
    }
    this._element.classList.remove('visibility-animating');
  }

  reject() {
    if (this._promiseDetails !== null) {
      this._promiseDetails.resolve(false);
      this._promiseDetails = null;
      this._timeout = null;
      console.log('rejection');
    }
    this._element.classList.remove('visibility-animating');
  }
}

class PromiseUtility {
  static createDeferredPromise() {
    let resolve;
    let reject;
    const promise = new Promise((resolve2, reject2) => {
      resolve = resolve2;
      reject = reject2;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
}
