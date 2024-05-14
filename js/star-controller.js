class StarController extends EventEmitter {
  constructor(controller) {
    super();
    this._controller = controller;
    this._speedFactor = 2;
    this._circleDegrees = 360;
    this._movementDistance = 100;
    this._half = 0.5;
    this._animFactor = 10000;
    this._starCount = 50;
    this._foreground = document.querySelector('.foreground');
    this._stars = document.getElementById('stars');
    this._background = document.querySelector('.background');
    this._eventListenerGroup = new EventListenerGroup();
  }

  prepare() {
    this._eventListenerGroup.on(this._controller, 'section-change', this._onSectionChange.bind(this));
    for (let i = 0; i < this._starCount; i++) {
      this._createStar();
    }
    this._moveStars(0);
  }

  _createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * window.innerWidth * 3}px`;
    star.style.top = `${Math.random() * window.innerHeight * 3}px`;
    this._stars.appendChild(star);
    const speed = 1 + Math.random() * this._speedFactor;
    const direction = Math.random() * this._circleDegrees;
    const animation = star.animate([
      { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 },
      { transform: `translate(${Math.cos(direction) * this._half * this._movementDistance}px, ${Math.sin(direction) * this._movementDistance}px) scale(0.1)`, opacity: 1 },
      { transform: `translate(${Math.cos(direction) * this._movementDistance}px, ${Math.sin(direction) * this._movementDistance}px) scale(0.1)`, opacity: 0 }
    ], {
      duration: speed * this._animFactor,
      iterations: Infinity,
      easing: 'linear'
    });
  }

  _moveStars(x) {
    this._foreground.style.transform = `translateX(${(x) * 30}px)`;
    this._stars.style.transform = `translateX(${(x) * 20}px) rotateY(${(x) * -3}deg)`;
    this._background.style.transform = `translateX(${(x) * 10}px)`;
  }

  _onSectionChange(event) {
    this._moveStars(-event.x);
  }
}
