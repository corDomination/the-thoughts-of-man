class BstudController {
    constructor() {
        this._data = null;
    }

    async prepare() {
        let url = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 'data/studies.json' : 'https://cordomination.github.io/the-thoughts-of-man/data/studies.json';
        const response = await fetch(url);
        const json = await response.json();
        this._data = json.entries[0];
        const title = document.querySelector('.page-section-title');
        title.textContent = this._data.name;
        const caption = document.querySelector('.page-section-caption');
        caption.textContent = this._data.date;
        const contents = document.querySelector('.page-section-contents-list');
        for (const entry of this._data.contents) {
            const li = document.createElement('li');
            li.textContent = entry;
            contents.appendChild(li);
        }
        const links = document.querySelector('.page-section-links');
        for(const entry of this._data.links) {
            const link = document.createElement('a');
            link.textContent = entry.text;
            link.href = entry.url;
            links.appendChild(link);
        }
    }
}



(() => {
    const controller = new BstudController();
    controller.prepare();
})();