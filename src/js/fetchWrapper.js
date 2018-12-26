class FetchWrapper {
  corsFetch(url, method) {
    const urlProxy = 'https://cors-anywhere.herokuapp.com/'
    const requestURL = urlProxy + url
    return new Promise((resolve, reject) => {
     fetch(requestURL, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
        }
      })
      .then(res => {
        return res.text()
      })
      .then(res_in_str => {
        resolve(res_in_str)
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  htmlToElement(html) {
    return document.createRange().createContextualFragment(html)
  }

  fetchPageHTML(html) {
    return new Promise((resolve, reject) => {
      // Only interested in html file, not other types
      const htmlOption = { headers: { "Content-Type": "text/html" }}
      fetch(html, htmlOption)
        .then(resp => resp.text())
        .then(html => resolve(html))
        .catch(err => reject(err))
    })
  }

  fetchDOM(url) {
    return new Promise((resolve, reject) => {
      this.fetchPageHTML(url)
        .then(html => {
          resolve(this.htmlToElement(html))
        })
    })
  }
}

export default new FetchWrapper()
