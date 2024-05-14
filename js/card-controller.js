class CardController {
  constructor(controller) {
    this._controller = controller;
    this._rotationMax = 25;
    this._halfRotation = 180;
    this._animationDuration = 1000;
    this._centeringTwo = 2;
    this._eventListenerGroup = new EventListenerGroup();
    this._activeCard = null;
    this._cardsMap = new Map();
  }

  prepare() {
    const specialCards = document.querySelectorAll('.special-card');
    for (const card of specialCards) {
      card.addEventListener('mousemove', this._onMouseMove.bind(this, card));
      card.addEventListener('mouseleave', this._onMouseLeave.bind(this, card));
      card.addEventListener('click', this._onMouseClick.bind(this, card));

      const links = card.querySelectorAll('a');
      for (const button of links) {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }
      this._cardsMap.set(card, {
        element: card,
        position: { x: 0, y: 0 },
        rotation: { x: 0, y: 0 }
      })
    }
    const cards = document.querySelectorAll('.card');
    for (const card of cards) {
      card.addEventListener('mousemove', this._onMouseMove.bind(this, card));
      card.addEventListener('mouseleave', this._onMouseLeave.bind(this, card));
      card.addEventListener('click', this._onMouseClick.bind(this, card));

      const links = card.querySelectorAll('a');
      for (const button of links) {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
        });
      }
      this._cardsMap.set(card, {
        element: card,
        position: { x: 0, y: 0 },
        rotation: { x: 0, y: 0 }
      })
    }
    this._eventListenerGroup.on(this._controller, 'tick', this._onTick.bind(this));
  }

  setRotation(element, x, y) {
    const card = this._cardsMap.get(element)
    card.rotation.x = x;
    card.rotation.y = y;
  }

  setPosition(x, y) {
    const card = this._cardsMap.get(element)
    card.position.x = x;
    card.position.y = y;
  }

  _onMouseMove(card, event) {
    const flipped = card.classList.contains('flipped') ? this._halfRotation : 0;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / this._centeringTwo)) / rect.width * this._rotationMax;
    const y = -(event.clientY - (rect.top + rect.height / this._centeringTwo)) / rect.height * this._rotationMax;
    if (card.classList.contains('animating')) { return; }
    this.setRotation(card, parseInt(y, 10), parseInt(x + flipped, 10));
  }

  _onMouseLeave(card, event) {
    const flipped = card.classList.contains('flipped') ? this._halfRotation : 0;
    this.setRotation(card, 0, flipped);
  }

  _onMouseClick(card, event) {
    card.classList.toggle('flipped');

    const flipped = card.classList.contains('flipped') ? this._halfRotation : 0;
    this.setRotation(card, 0, flipped);
  }

  _onTick(time) {
    let index = 0;
    for (const card of this._cardsMap.values()) {
      index++;
      const offset = Math.cos(time * 0.001 + index) * 4;
      const offset2 = Math.sin(time * 0.002 + index) * 1.5;
      const offset3 = Math.sin(time * 0.001 + index) * 2;
      const { element, rotation, position } = card;
      element.style.transform = `rotateX(${rotation.x + offset2 * 2}deg) rotateY(${rotation.y + offset3 * 2}deg) translate(${position.x}px, ${position.y + offset}px)`
    }
  }
}
