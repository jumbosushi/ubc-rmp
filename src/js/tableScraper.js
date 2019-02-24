class Professor {
  constructor(name, rating) {
    this.name = name;
    this.rating = rating;
  }
}

// TODO: Make class less bloated
class TableScraper {
  constructor() {
    this.rows =  document.getElementsByClassName("table table-striped section-summary")[0].rows
    this.lectureRows = {}
    this.lectureURLtoRowNum = {}
    this.ratings = {}
  }

  // True if found data for given lecture row
  isLectureRowWithData(rowNum) {
    return this.lectureRows[rowNum] != null
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

  getLectureURL(i) {
    return this.rows[i].cells[1].getElementsByTagName('a')[0].href
  }

  getLectureRowNumbers() {
    let numbers = []
    for (var i = 1; i < this.rows.length; i++) {
      if (this.isLecture(i)) {
        numbers.push(i)
      }
    }
    return numbers
  }

  getProfNameFromDOM(dom) {
    // TODO: Edge case when there's two prof
    // https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section&dept=COMM&course=293&section=102
    function flipName(name) {
      const separated = name.trim().split(', ')
      return `${separated[1]} ${separated[0]}`
    }

    function isLoggedIn() {
      return document.querySelectorAll("form").length == 4
    }

    // If user is logged in, page injects additional form into the page
    // Hence, we need to change table index depending on login state
    //
    // One way to detect login state is to check if number of forms in the page
    // If there are 4 forms, the user is logged in
    let profName = dom.querySelectorAll("table")[2].rows[0].cells[1].innerText

    if (profName) {
      return flipName(profName)
    } else {
      throw "Name not in class page"
    }
  }

  setLectureURLtoRowNum() {
    for (var i = 1; i < this.rows.length; i++) {
      if (this.isLecture(i)) {
        const lectureUrl = this.getLectureURL(i)
        // Temp save url and i
        // This is because Promise won't let i be saved in its instance
        this.lectureURLtoRowNum[lectureUrl] = i
      }
    }
  }
}

export default new TableScraper()
