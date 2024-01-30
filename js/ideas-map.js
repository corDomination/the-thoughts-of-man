  class IdeasMapController {
    constructor() {
        this._selectedCard = null;
        this._cardDataMap = new Map();
        this._cardContainer = document.querySelector('.card-container');
        this._contents = document.querySelector('.card-selected-details');
        this._contentsHeader = document.querySelector('.card-header');
        this._contentTitle = this._contents.querySelector('.card-title');
        this._contentIcon = this._contents.querySelector('.card-icon');
        this._contentContents = this._contents.querySelector('.card-contents');
    }

    async prepare() {
        const md = window.markdownit();
        const json = await Utility.fetchJSON('data/ideas-map.json');
        const data = json.data;
        const template = this.getTemplate('card-template');
        for(const entry of data) {
            const markdownData = await fetch(`data/markdown/${entry.url}`);
            const markdownText = await markdownData.text();
            const element = template.cloneNode(true).content.children[0];
            const title = element.querySelector('.card-title');
            const icon = element.querySelector('.card-icon');
            const contents = element.querySelector('.card-contents');
            icon.dataset.icon = entry.icon;
            title.textContent = entry.title;
            element.id = entry.title;
            let ideaContent;
            if(entry.complete) {
              const markdown = md.render(markdownText);
              ideaContent = markdown;
            } else {
              ideaContent = 'Under Construction';
            }
            const card = this._cardContainer.appendChild(element);
            this._cardDataMap.set(card, {
              ideaContent,
              entry
            });
            card.addEventListener('click', this.onCardClick.bind(this, card));
        }
        this._contentsHeader.addEventListener('click', this._onCardContents.bind(this));
        this.setCard(null);
    }

    setCard(card) {
      const exists = card !== null;
      this._selectedCard = card;
      this._contents.hidden = !exists;
      this._cardContainer.hidden = exists;
      if (card === null) { return; }
      const data = this._cardDataMap.get(card);
      this._contentIcon.dataset.icon = data.entry.icon;
      this._contentTitle.textContent = data.entry.title;
      this._contentContents.innerHTML = data.ideaContent;
      const childArray = this._contentContents.children;
      for(let i = 0; i < childArray.length; i++) {
        const child = childArray[i];
        child.classList.add(`enter-${i}`);
      }
    }

    getTemplate(id) {
        const template = document.querySelector(`#${id}`);
        const clone = template.cloneNode(true);
        return clone;
    }

    onCardClick(card) {
      this.setCard(card);
    }

    _onCardContents() {
      this.setCard(null);
    }
  } 
  
(() => {
    window.addEventListener('load', () => {
      const controller = new IdeasMapController();
      controller.prepare();
    })
})();