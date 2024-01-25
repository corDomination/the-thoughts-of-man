  class IdeasMapController {
    constructor() {
        
    }

    async prepare() {
        const md = window.markdownit();
        let url = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 'data/ideas-map.json' : '/the-thoughts-of-man/data/ideas-map.json';
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
            element.dataset.color = entry.icon.color;
            if(entry.complete) {
              const markdown = md.render(markdownText);
              contents.innerHTML = markdown;
            } else {
              contents.innerHTML = 'Under Construction';
            }
            const card = parent.appendChild(element);
            card.addEventListener('click', this.onCardClick.bind(this));
        }
    }

    getTemplate(id) {
        const template = document.querySelector(`#${id}`);
        const clone = template.cloneNode(true);
        return clone;
    }

    async onCardClick() {
    }
  } 
  
(() => {
    const controller = new IdeasMapController();
    controller.prepare();
})();