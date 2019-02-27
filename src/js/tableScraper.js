// TODO: Make class less bloated
class TableScraper {
  constructor() {
    let tableClass = "table table-striped section-summary"
    this.rows =  document.getElementsByClassName(tableClass)[0].rows
    this.lectureRows = {}
  }

  getLectureRows() {
    // If empty run set method
    if (Object.keys(this.lectureRows).length === 0) {
      this.setLectureRows()
    }

    return this.lectureRows
  }

  // True if found data for given lecture row
  isLectureRowWithData(rowNum) {
    return this.lectureRows[rowNum] != null
  }

  getSection(i) {
    // ex. "CPSC 313 101"
    let section = this.rows[i].cells[1].innerText
    return section.split(' ').pop()
  }

  getLectureRowRating(i) {
    return this.lectureRows[i]
  }

  serializeLectureStats(rowNum) {
  let stat = this.lectureRows[rowNum]
  return `Name: ${stat.name}\n\
          Overall: ${stat.over_all}\n\
          Difficulty: ${stat.difficulty}\n\
          Would Take Again: ${stat.would_take_again}`
  }

  isLecture(i) {
    let section = this.rows[i].cells[1].innerText
    let activity = this.rows[i].cells[2].innerText
    // TODO: Include distance education
    return activity.includes("Lecture") && section != ""
  }

  setLectureRows() {
    for (var i = 1; i < this.rows.length; i++) {
      if (this.isLecture(i)) {
        // TODO: Save Section Number
        // Temp save url and i
        // This is because Promise won't let i be saved in its instance
        let section = this.getSection(i)
        this.lectureRows[i] = section
      }
    }
  }
}

export default new TableScraper()
