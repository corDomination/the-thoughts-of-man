class Utility {
  static async fetchJSON(filePath) {
    const url = location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? `${filePath}` : `/the-thoughts-of-man/${filePath}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  }

  static parseDateHeader(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
