import { Utility } from '/js/utility.js';

export class TimerController {
  constructor(parent) {
    this._parent = parent;
    const timerTemplate = Utility.getTemplate('timer-template');
    this._element = this._parent.appendChild(timerTemplate);
    this._timerStateButton = this._element.querySelector('.timer-state-button');
    this._timerTimeElement = this._element.querySelector('.timer-time');
    this._timerResetButton = this._element.querySelector('.timer-reset-button');
    this._timerPlaying = false;
    this._timerTime = 0;
    this._timingInterval = null;
    this._updateMS = 1000;
  }

  prepare() {
    this._timerStateButton.addEventListener('click', this.toggleTimer.bind(this));
    this._timerResetButton.addEventListener('click', this.resetTimer.bind(this));
    this.updateTimer()
  }

  toggleTimer() {
    this._timerPlaying = !this._timerPlaying;
    if (this._timerPlaying) {
      this._timingInterval = setInterval(() => {
        this._timerTime += 1;
        this.updateTimer();
      }, this._updateMS);
    } else {
      clearInterval(this._timingInterval);
    }
    this._timerStateButton.dataset.icon = this._timerPlaying ? 'pause' : 'play';
  }

  resetTimer() {
    this._timerTime = 0;
    this.updateTimer();
    if (this._timerPlaying) {
      this.toggleTimer();
    }
    if (this._timingInterval !== null) {
      clearInterval(this._timingInterval);
    }
  }

  updateTimer() {
    this._timerTimeElement.textContent = `${this._timerTime}s`;
  }

  setVisible(value) {
    if (this._timerPlaying) {
      this.toggleTimer();
    }
    this._element.hidden = !value;
  }
}
