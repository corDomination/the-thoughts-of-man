class Utility {
  static async fetchJSON(filePath) {
    const url = location.hostname === 'localhost' || location.hostname === '127.0.0.1' ? `${filePath}` : `/the-thoughts-of-man/${filePath}`;
    const response = await fetch(url);
    const date = response.headers.get('Last-Modified');
    const json = await response.json();
    return json;
  }
}
