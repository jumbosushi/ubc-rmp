import Scraper from './tableScraper.js'

class Loader {
  constructor() {
    let lectureRows = Scraper.getLectureRows()
    let lectureRowNumbers = Object.keys(lectureRows)
    let links = lectureRowNumbers.map(i => {
      return Scraper.rows[i].cells[1].children[0]
    })

    this.lectureLinkElements = links
  }

  set() {
    this.lectureLinkElements.map(elm => {
      elm.classList.add('blink-loader')
    })
  }

  clear() {
    this.lectureLinkElements.map(elm => {
      elm.classList.remove('blink-loader')
    })
  }
}

export default new Loader()
