class ContentsController {
  constructor(controller) {
    this._animationDuration = 250;
    this._controller = controller;
    this._cardSelectedDetails = document.querySelector('.card-selected-details');
    this._header = document.querySelector('.card-header');
    this._title = this._cardSelectedDetails.querySelector('.card-title');
    this._icon = this._cardSelectedDetails.querySelector('.card-icon');
    this._contents = this._cardSelectedDetails.querySelector('.card-contents');
    this._contentsVisibilityController = new ElementVisibilityController(this._cardSelectedDetails, this._animationDuration);
    this._eventListenerGroup = new EventListenerGroup();
  }

  prepare() {
    this._eventListenerGroup.addEventListener(this._header, 'click', this._onHeaderClick.bind(this))
    this._eventListenerGroup.on(this._controller, 'card-change', this._onCardChange.bind(this))
    this._eventListenerGroup.on(this._controller, 'section-change', this._onSectionChange.bind(this))
  }

  setCard(data) {
    // this._contents.scrollTop = 0;
    this._contentsVisibilityController.setVisible(data !== null, true);
    if (data === null) { return; }
    const { entry, ideaContent } = data;
    this._icon.dataset.icon = entry.icon;
    this._title.textContent = entry.title;
    this._contents.innerHTML = ideaContent;
    const childArray = this._contents.children;
    for (let i = 0; i < childArray.length; i++) {
      const child = childArray[i];
      child.classList.add(`enter-${i}`);
    }
  }

  _onHeaderClick() {
    this._controller.setCard(null);
  }

  _onCardChange(event) {
    this.setCard(event);
  }

  _onSectionChange(event) {
    this.setCard(null);
  }
}
