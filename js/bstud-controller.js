class BstudController {
    constructor() {
        this._data = null;
    }
    
    async prepare() {
        const json = await Utility.fetchJSON('data/studies.json')
        this._data = json.entries;
        const sectionTemplate = document.querySelector('.page-section');
        const body = document.querySelector('body');
        for(const data of this._data) {
            const section = sectionTemplate.cloneNode(true);
            const title = section.querySelector('.page-section-title');
            title.textContent = data.name;
            const caption = section.querySelector('.page-section-caption');
            caption.textContent = data.date;
            const contentsList = section.querySelector('.page-section-contents-list');
            if (typeof data.contents === 'string') {
                await this._prepareMarkdownStudy(contentsList, data.contents);
            } else {
                this._prepareJSONStudy(contentsList, data)
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

    _prepareJSONStudy(parent, data) {
        for (const entry of data.contents) {
            const li = document.createElement('li');
            li.textContent = entry;
            parent.appendChild(li);
        }
    }

    async _prepareMarkdownStudy(parent, studyName) {
        const md = window.markdownit();
        const markdownData = await fetch(`data/markdown/studies/${studyName}.md`);
        const markdownText = await markdownData.text();
        const markdown = md.render(markdownText);
        parent.innerHTML = markdown;
    }
}



(() => {
    const controller = new BstudController();
    controller.prepare();
})();