import CourseScraper from './courseScraper.js'

class Loader {
  constructor() {
    let lectureRows = CourseScraper.getLectureRows()
    let lectureRowNumbers = Object.keys(lectureRows)
    let links = lectureRowNumbers.map(i => {
      return CourseScraper.rows[i].cells[1].children[0]
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
