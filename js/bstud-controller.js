class BstudController {
    constructor() {
        this._data = null;
    }

    async prepare() {
        let url = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 'data/studies.json' : 'https://cordomination.github.io/the-thoughts-of-man/data/studies.json';
        const response = await fetch(url);
        const json = await response.json();
        this._data = json.entries;
        const sectionTemplate = document.querySelector('.page-section');
        const body = document.querySelector('body');
        for(const data of this._data) {
            const section = sectionTemplate.cloneNode(true);
            const title = section.querySelector('.page-section-title');
            title.textContent = data.name;
            const caption = section.querySelector('.page-section-caption');
            caption.textContent = data.date;
            const contents = section.querySelector('.page-section-contents-list');
            for (const entry of data.contents) {
                const li = document.createElement('li');
                li.textContent = entry;
                contents.appendChild(li);
            }
            const links = section.querySelector('.page-section-links');
            for(const entry of data.links) {
                const link = document.createElement('a');
                link.textContent = entry.text;
                link.href = entry.url;
                links.appendChild(link);
            }
            body.appendChild(section);
        }
        sectionTemplate.remove();
    }
}



(() => {
    const controller = new BstudController();
    controller.prepare();
})();