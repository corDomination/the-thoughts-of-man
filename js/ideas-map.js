  class IdeasMapController {
    constructor() {
        
    }

    async prepare() {
        const md = window.markdownit();
        let url = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 'data/ideas-map.json' : '../data/ideas-map.json';
        const response = await fetch(url);
        const json = await response.json();
        const data = json.data;
        const parent = document.querySelector('.card-container');
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
            const markdown = md.render(markdownText);
            contents.innerHTML = markdown;
            const card = parent.appendChild(element);
            card.addEventListener('click', this.onCardClick.bind(this, markdown));
        }
    }

    getTemplate(id) {
        const template = document.querySelector(`#${id}`);
        const clone = template.cloneNode(true);
        return clone;
    }

    onCardClick(markdown) {
      const content = document.querySelector('.section-content');
      content.focus();
      content.innerHTML = markdown;
    }
  } 
  
(() => {
    const controller = new IdeasMapController();
    controller.prepare();
})();