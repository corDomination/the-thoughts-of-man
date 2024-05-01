class StarController {
  constructor() {
    this._speedFactor = 2;
    this._circleDegrees = 360;
    this._movementDistance = 100;
    this._half = 0.5;
    this._animFactor = 10000;
    this._starCount = 100;
  }

  initiateStars() {
    for (let i = 0; i < this._starCount; i++) {
      this._createStar();
    }
  }

  _createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * window.innerHeight}px`;
    document.getElementById('stars').appendChild(star);
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
}
