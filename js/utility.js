class Utility {
    static async fetchJSON(filePath) {
        let url = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? `${filePath}` : `${location.hostname}/the-thoughts-of-man/${filePath}`;
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }
}