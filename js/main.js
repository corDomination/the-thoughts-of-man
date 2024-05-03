class IdeasMapController {
  constructor() {
    this._selectedCard = null;
    this._cardDataMap = new Map();
    this._titleWord = document.querySelector('.title-word');
    this._cardSelectedDetails = document.querySelector(
      '.card-selected-details'
    );
    this._contentsHeader = document.querySelector('.card-header');
    this._contentTitle = this._cardSelectedDetails.querySelector('.card-title');
    this._contentIcon = this._cardSelectedDetails.querySelector('.card-icon');
    this._contentContents =
      this._cardSelectedDetails.querySelector('.card-contents');
    this._sections = new Map();
    this._activeSection = null;
    this._animationDuration = 250;
    this._contentsVisibilityController = new ElementVisibilityController(
      this._cardSelectedDetails,
      this._animationDuration
    );
    this._transitioning = false;
    // this._timerController = null;
    this._wakeLock = null;
    this._sceneController = null;
    this._starController = new StarController();
    this._cardController = new CardController();
    this._sectionNumber = 0;
  }

  async prepare() {
    this._starController.moveStars(0);
    this._setupHeaderLinks();
    const md = window.markdownit();
    const json = await Utility.fetchJSON('data/data.json');
    const sections = json.sections;
    const sectionsContainer = document.querySelector('.content');
    for (const sectionData of sections) {
      const section = Utility.getTemplate('section-group-template');
      section.dataset.topic = sectionData.name;
      if (sectionData.name === 'earth') {
        const earthTemplate = Utility.getTemplate('earth-template');
        const earthContents = section.appendChild(earthTemplate);
        const canvas = document.querySelector('.earth-canvas');
        this._sceneController = new SceneController(canvas);
      }
      if (sectionData.name === 'home') {
        const homeTemplate = Utility.getTemplate('home-template');
        section.appendChild(homeTemplate);
        // sectionData.data.append() // TODO: Append 5 links to recent entries.
      }
      if (sectionData.name === 'workouts') {
        const workoutsTemplate = Utility.getTemplate('workouts-template');
        section.appendChild(workoutsTemplate);
        // this._timerController = new TimerController(this._cardSelectedDetails);
        // this._timerController.prepare();

        // document
        //   .getElementById('toggle-switch-checkbox')
        //   .addEventListener('change', () => {
        //     if ('wakeLock' in navigator) {
        //       if (this.checked) {
        //         navigator.wakeLock.request('screen').catch(console.error);
        //       } else if (this._wakeLock !== null) {
        //         this._wakeLock.release().catch(console.error);
        //         this._wakeLock = null;
        //       }
        //     } else {
        //       console.log('Wake Lock API not supported');
        //     }
        //   });
      }

      const template = Utility.getTemplate('card-template');
      for (const entry of sectionData.data) {
        if (typeof entry.complete !== 'undefined' && !entry.complete) {
          continue;
          // element.classList.add('disabled');
        }
        const markdownData = await fetch(
          `data/markdown/${sectionData.name}/${entry.url}.md`
        );
        const unformattedDate = markdownData.headers.get('Last-Modified');
        const lastEditedDate = Utility.parseDateHeader(unformattedDate);
        const markdownText = await markdownData.text();
        const element = template.cloneNode(true);
        const title = element.querySelector('.card-title');
        const icon = element.querySelector('.card-icon');
        const date = element.querySelector('.card-date');
        icon.dataset.icon = entry.icon;
        title.textContent = entry.title;
        element.id = entry.title;
        date.textContent =
          typeof entry.date !== 'undefined' ? entry.date : lastEditedDate;
        const ideaContent = md.render(markdownText);
        const card = section.appendChild(element);
        this._cardDataMap.set(card, {
          ideaContent,
          entry,
        });
        card.addEventListener('click', this.onCardClick.bind(this, card));
      }
      this._contentsHeader.addEventListener(
        'click',
        this._onCardContents.bind(this)
      );
      const sectionElement = sectionsContainer.appendChild(section);
      const sectionVisibilityController = new ElementVisibilityController(
        section,
        this._animationDuration
      );
      this._sections.set(sectionData.name, {
        name: sectionData.name,
        element: sectionElement,
        visibilityController: sectionVisibilityController,
        x: this._sectionNumber
      });
      this._sectionNumber++;
    }
    this.showLoadingOverlay(false);
    this._starController.initiateStars();
    await new Promise((r) => setTimeout(r, 500));
    this.setActiveSection('home');
    this._cardController.prepare();
  }

  async setActiveSection(name) {
    if (name === this._activeSection || this._transitioning) {
      return;
    }
    document.documentElement.dataset.section = name;
    await this.setCard(null, true);
    this._transitioning = true;
    const lastSection = this._sections.get(this._activeSection);

    const updatedSection = this._sections.get(name);
    this._starController.moveStars(-updatedSection.x);
    if (typeof lastSection !== 'undefined') {
      await lastSection.visibilityController.setVisible(false);
    }
    this._titleWord.textContent = updatedSection.name;

    const isEarth = updatedSection.name === 'earth';
    this._sceneController.canvas.hidden = !isEarth;
    if (isEarth) {
      this._sceneController.prepare();
    }
    await updatedSection.visibilityController.setVisible(true);
    this._activeSection = name;
    this._transitioning = false;
    console.log(this._activeSection, '->', name);
  }

  async setCard(card, immediate = false) {
    if (this._selectedCard === card || this._transitioning) {
      return;
    }
    this._selectedCard = card;
    this._transitioning = true;
    if (card !== null) {
      window.scrollTo(0, 0);
      const data = this._cardDataMap.get(card);
      this._contentIcon.dataset.icon = data.entry.icon;
      this._contentTitle.textContent = data.entry.title;
      this._contentContents.innerHTML = data.ideaContent;
      const childArray = this._contentContents.children;
      for (let i = 0; i < childArray.length; i++) {
        const child = childArray[i];
        child.classList.add(`enter-${i}`);
      }
    }
    const currentSection = this._sections.get(this._activeSection);
    // this._timerController.setVisible(
    //   currentSection.name === 'workouts' && card !== null
    // );
    const exists = card !== null;
    if (card === null) {
      await this._contentsVisibilityController.setVisible(exists, immediate);
      await currentSection.visibilityController.setVisible(!exists, immediate);
    } else {
      await currentSection.visibilityController.setVisible(!exists, immediate);
      await this._contentsVisibilityController.setVisible(exists, immediate);
    }
    this._transitioning = false;
  }

  onCardClick(card) {
    console.log('card clicked');
    this.setCard(card);
  }

  _onCardContents() {
    this.setCard(null);
  }

  _setupHeaderLinks() {
    const headerLinks = document.querySelectorAll('.header-link');
    for (const link of headerLinks) {
      link.addEventListener('click', () => {
        this.setActiveSection(link.dataset.section);
      });
    }
  }

  showLoadingOverlay(value) {
    document.getElementById('loading-overlay').style.display = value ? 'flex' : 'none';
  }
}

(() => {
  window.addEventListener('load', () => {
    const controller = new IdeasMapController();
    controller.prepare();
  });
})();
