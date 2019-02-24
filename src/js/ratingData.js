class RatingData {
  constructor() {
    this.json = {}

    // TODO: Make this load from /data once webpack is configured
    // Takes roughly 1.2 ms to load this
    this.loadJSON("src/data/filledInstrData.json",
      function(data) { this.json = data; },
      function(xhr) { console.error(xhr); }
    )
  }

  // Load JSON data as JS Object
  loadJSON(path, success, error) {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function()
      {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            if (success)
              success(JSON.parse(xhr.responseText))
          } else {
            if (error)
              error(xhr)
            }
        }
      };
      let fullPath = chrome.extension.getURL(path)
      xhr.open("GET", fullPath, true)
      xhr.send()
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
