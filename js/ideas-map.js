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
            const element = template.cloneNode(true);
            const title = element.querySelector('.card-title');
            const icon = element.querySelector('.card-icon');
            const contents = element.querySelector('.card-contents');
            icon.dataset.icon = entry.icon;
            title.textContent = entry.title;
            element.id = entry.title;
            contents.innerHTML = md.render(markdownText);
            parent.appendChild(element);
        }
    }

    getTemplate(id) {
        const template = document.querySelector(`#${id}`);
        const clone = template.content.cloneNode(true);
        return clone;
    }
  } 
  
(() => {
    const controller = new IdeasMapController();
    controller.prepare();
})();