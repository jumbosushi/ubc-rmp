class RatingData {
  constructor() {
    // TODO: Make this load from /data once webpack is configured
    // Takes roughly 1.2 ms to load this
    this.json = {}
  }

  // Load JSON data as JS Object
  loadJSON(success, error) {
    return new Promise((resolve, reject) => {
      let path = "src/data/filledInstrData.json"
      let fullPath = chrome.extension.getURL(path)

      fetch(fullPath)
        .then(data => {
          data.json().then(jsonObj => {
            this.json = jsonObj
            resolve(jsonObj)
          })
        })
        .catch(err => reject(err))
    })
  }

  // TODO :Decide to keep this or not
  getProfStat(html, profUrl) {
    const dom = Fetcher.htmlToElement(html)
    let first = dom.querySelector(".pfname").innerText.trim().toUpperCase()
    let last = dom.querySelector(".plname").innerText.trim().toUpperCase()

    const name = `${first} ${last}`
    const ratingBreakdown = dom.querySelectorAll(".rating-breakdown")[0]
    const grades = ratingBreakdown.querySelectorAll(".grade")
    return {
      name: name,
      over_all: grades[0].innerText.trim(),
      would_take_again: grades[1].innerText.trim(),
      difficulty: grades[2].innerText.trim(),
      url: profUrl
    }
  }
}

export default RatingData
