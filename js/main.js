class IdeasMapController {
  constructor() {
    this._selectedCard = null;
    this._cardDataMap = new Map();
    this._titleWord = document.querySelector('.title-word');
    this._contents = document.querySelector('.card-selected-details');
    this._contentsHeader = document.querySelector('.card-header');
    this._contentTitle = this._contents.querySelector('.card-title');
    this._contentIcon = this._contents.querySelector('.card-icon');
    this._contentContents = this._contents.querySelector('.card-contents');
    this._sections = new Map();
    this._activeSection = null;
    this._animationDuration = 250;
    this._contentsVisibilityController = new ElementVisibilityController(this._contents, this._animationDuration);
    this._transitioning = false;
  }

  async prepare() {
    this._setupHeaderLinks();
    const md = window.markdownit();
    const json = await Utility.fetchJSON('data/data.json');
    const sections = json.sections;
    const sectionsContainer = document.querySelector('.content');
    for (const sectionData of sections) {
      const section = this.getTemplate('section-group-template');
      section.dataset.topic = sectionData.name;

      if (sectionData.name === 'home') {
        const homeTemplate = this.getTemplate('home-template');
        section.appendChild(homeTemplate);
      }
      if (sectionData.name === 'workouts') {
        const workoutsTemplate = this.getTemplate('workouts-template');
        section.appendChild(workoutsTemplate);
      }

      const template = this.getTemplate('card-template');
      for (const entry of sectionData.data) {
        const markdownData = await fetch(`data/markdown/${sectionData.name}/${entry.url}.md`);
        const unformattedDate = markdownData.headers.get('Last-Modified');
        const lastEditedDate = Utility.parseDateHeader(unformattedDate);
        console.log(lastEditedDate, unformattedDate);
        const markdownText = await markdownData.text();
        const element = template.cloneNode(true);
        const title = element.querySelector('.card-title');
        const icon = element.querySelector('.card-icon');
        const date = element.querySelector('.card-date');
        icon.dataset.icon = entry.icon;
        title.textContent = entry.title;
        element.id = entry.title;
        if (typeof entry.complete !== 'undefined' && !entry.complete) {
          element.classList.add('disabled');
        }
        date.textContent = typeof entry.date !== 'undefined' ? entry.date : lastEditedDate;
        const ideaContent = md.render(markdownText);
        const card = section.appendChild(element);
        this._cardDataMap.set(card, {
          ideaContent,
          entry
        });
        card.addEventListener('click', this.onCardClick.bind(this, card));
      }
      this._contentsHeader.addEventListener('click', this._onCardContents.bind(this));
      const sectionElement = sectionsContainer.appendChild(section);
      const sectionVisibilityController = new ElementVisibilityController(section, this._animationDuration);
      this._sections.set(sectionData.name, {
        name: sectionData.name,
        element: sectionElement,
        visibilityController: sectionVisibilityController
      });
    }
    this.setActiveSection('home');
  }

  async setActiveSection(name) {
    if (name === this._activeSection || this._transitioning) { return; }
    await this.setCard(null, true);
    document.documentElement.dataset.section = name;
    this._transitioning = true;
    const lastSection = this._sections.get(this._activeSection);
    if (typeof lastSection !== 'undefined') {
      await lastSection.visibilityController.setVisible(false);
    }
    const updatedSection = this._sections.get(name);
    this._titleWord.textContent = updatedSection.name;
    await updatedSection.visibilityController.setVisible(true);
    this._activeSection = name;
    this._transitioning = false;
    console.log(this._activeSection, '->', name);
  }

  async setCard(card, immediate = false) {
    if (this._selectedCard === card) { return; }
    const exists = card !== null;
    this._selectedCard = card;

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
    if (card === null) {
      await this._contentsVisibilityController.setVisible(exists, immediate);
      await currentSection.visibilityController.setVisible(!exists, immediate);
    } else {
      await currentSection.visibilityController.setVisible(!exists, immediate);
      await this._contentsVisibilityController.setVisible(exists, immediate);
    }
  }

  getTemplate(id) {
    const template = document.querySelector(`#${id}`);
    const clone = template.cloneNode(true).content.children[0];
    return clone;
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
}

(() => {
  window.addEventListener('load', () => {
    const controller = new IdeasMapController();
    controller.prepare();
  });
})();
