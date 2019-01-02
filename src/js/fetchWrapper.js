class FetchWrapper {
  corsFetch(url, method) {
    const urlProxy = 'https://ubc-rmp.herokuapp.com/'
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

  // TODO: Doesn't work
  fetchReLogin() {
    let loginLink = "https://cas.id.ubc.ca/ubc-cas/login"
    console.log("==== RELOGIN ====")
    fetch(loginLink)
      .then(res => {
        debugger
      })
      .catch(err => {
        debugger
        console.log(err)
      })
  }

  fetchPageHTML(html) {
    return new Promise((resolve, reject) => {
      // Only interested in html file, not other types
      const htmlOption = { headers: { "Content-Type": "text/html" }}
      console.log('cors now')
      this.corsFetch(html, 'GET')
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
