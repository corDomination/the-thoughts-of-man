class CardController {
  constructor() {
    this._rotationMax = 25;
    this._halfRotation = 180;
    this._animationDuration = 1000;
    this._centeringTwo = 2;
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
    }
  }

  setRotation(card, x, y) {
    card.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`
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
    card.classList.add('animating');
    setTimeout(() => {
      card.classList.remove('animating');
    }, this._animationDuration);

    const flipped = card.classList.contains('flipped') ? this._halfRotation : 0;
    this.setRotation(card, 0, flipped);
  }
}
