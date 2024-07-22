class Controller extends EventEmitter {
  constructor() {
    super();
    this._selectedCard = null;
    this._cardDataMap = new Map();
    this._sections = new Map();
    this._activeSection = null;
    this._animationDuration = 250;
    this._sectionNumber = -2;
    this._headerLinkEventGroup = new EventListenerGroup();
    this._sceneController = null;
    this._starController = new StarController(this);
    this._cardController = new CardController(this);
    this._contentsController = new ContentsController(this);
    this._contentElement = document.querySelector('.content');
    this._contentElementVisibilityController = new ElementVisibilityController(this._contentElement, this._animationDuration);

    this._timerTime = 0;
    this._updateMS = 100;
  }

  async prepare() {
    const headerLinks = document.querySelectorAll('.header-link');
    for (const link of headerLinks) {
      this._headerLinkEventGroup.addEventListener(link, 'click', this._onHeaderLinkClick.bind(this, link.dataset.section));
    }
    const md = window.markdownit();
    const json = await Utility.fetchJSON('data/data.json');
    const sections = json.sections;
    const sectionsContainer = document.querySelector('.content');
    for (const sectionData of sections) {
      const section = Utility.getTemplate('section-group-template');
      section.dataset.topic = sectionData.name;
      if (sectionData.name === 'earth') {
        const earthTemplate = Utility.getTemplate('earth-template');
        const earthSection = section.appendChild(earthTemplate);
        const canvasContainer = document.querySelector('.canvas-container');
        earthSection.appendChild(canvasContainer);
      }
      if (sectionData.name === 'home') {
        const homeTemplate = Utility.getTemplate('home-template');
        section.appendChild(homeTemplate);
      }
      if (sectionData.name === 'workouts') {
        const workoutsTemplate = Utility.getTemplate('workouts-template');
        section.appendChild(workoutsTemplate);
      }
      if (sectionData.name === 'articles') {
        const workoutsTemplate = Utility.getTemplate('articles-template');
        section.appendChild(workoutsTemplate);
      }
      if (sectionData.name === 'studies') {
        const workoutsTemplate = Utility.getTemplate('studies-template');
        section.appendChild(workoutsTemplate);
      }

      const template = Utility.getTemplate('card-template');
      const dynamicCardContainer = section.querySelector('.dynamic-card-container')
      for (const entry of sectionData.data) {
        if (typeof entry.complete !== 'undefined' && !entry.complete) {
          continue;
        }
        const markdownData = await fetch(`data/markdown/${sectionData.name}/${entry.url}.md`);
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
        const card = dynamicCardContainer.appendChild(element);
        this._cardDataMap.set(card, {
          ideaContent,
          entry
        });
        card.addEventListener('click', this.onCardClick.bind(this, card));
      }
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
    const canvas = document.querySelector('.earth-canvas');
    this._sceneController = new SceneController(this, canvas);
    this._sceneController.prepare();
    this._starController.prepare();
    this.setActiveSection('home');
    this._cardController.prepare();
    this._contentsController.prepare();
    this.beginAnimationFrames();
  }

  setActiveSection(name) {
    const previousSection = this._sections.get(this._activeSection);
    if (typeof previousSection !== 'undefined') {
      previousSection.visibilityController.setVisible(false, true);
    }

    this._activeSection = name;
    const updatedSection = this._sections.get(name);
    updatedSection.visibilityController.setVisible(true, true)
    updatedSection.element.scrollTop = 0;
    document.documentElement.dataset.section = name;
    document.documentElement.dataset.instantSection = name;
    this.emit('section-change', updatedSection);
  }

  setCard(card) {
    if (this._selectedCard === card) { return; }
    const exists = card !== null;
    const currentSection = this._sections.get(this._activeSection);
    currentSection.visibilityController.setVisible(!exists, true);
    this._selectedCard = card;
    if (!exists) {
      this.emit('card-change', null)
      return;
    }
    const data = this._cardDataMap.get(card);
    this._contentsController.setCard(data);
    this.emit('card-change', data)
  }

  onCardClick(card) {
    this.setCard(card);
  }

  _onHeaderLinkClick(section, event) {
    this.setActiveSection(section);
  }

  beginAnimationFrames() {
    this._timingInterval = setInterval(() => {
      this._timerTime += this._updateMS;
      this.emit('tick', this._timerTime);
    }, this._updateMS);
  }
}
