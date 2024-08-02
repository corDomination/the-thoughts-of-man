class PermissionRequestController {
  constructor() {
    this._requestTemplate = Utility.getTemplate('permission-request-template');
    /** @type {EventListenerGroup} */
    this._eventListenerGroup = new EventListenerGroup();
  }

  prepare(parent, callback) {
    const templateElement = parent.appendChild(this._requestTemplate);
    this._eventListenerGroup.addEventListener(templateElement, 'click', () => {
      callback();
      this._eventListenerGroup.clear();
      templateElement.remove();
    })
  }
}
