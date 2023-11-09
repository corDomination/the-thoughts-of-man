class BstudController {
    constructor() {
        this._data = null;
    }

    async prepare() {
        const response = await fetch('./data/studies.json');
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
        for(const entry of this._data.links) {
            const li = document.createElement('a');
            li.textContent = entry.text;
            li.src = entry.url;
            contents.appendChild = li;
        }
    }
}



(() => {
    const controller = new BstudController();
    controller.prepare();
})();