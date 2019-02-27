class RatingData {
  constructor() {
    // TODO: Make this load from /data once webpack is configured
    // Takes roughly 1.2 ms to load this
    this.courseJSON = {}
    this.ratingJSON = {}
  }

  loadCourseToInstr() {
    let path = "src/data/courseToInstrID.json"

    return new Promise((resolve, reject) => {
      let fullPath = chrome.extension.getURL(path)

      fetch(fullPath)
        .then(data => {
          data.json().then(jsonObj => {
            this.courseJSON = jsonObj
            resolve(jsonObj)
          })
        })
        .catch(err => reject(err))
    })
  }

  loadInstrToRating() {
    let path = "src/data/instrIDToRating.json"

    return new Promise((resolve, reject) => {
      let fullPath = chrome.extension.getURL(path)

      fetch(fullPath)
        .then(data => {
          data.json().then(jsonObj => {
            this.ratingJSON = jsonObj
            resolve(jsonObj)
          })
        })
        .catch(err => reject(err))
    })
  }

  // Return once both files are loaded
  loadJSON() {
    return new Promise((resolve, reject) => {
      Promise.all([this.loadCourseToInstr(), this.loadInstrToRating()])
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }
}

export default RatingData
