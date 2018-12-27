import RMP from './rmp.js'
import Fetcher from './fetchWrapper.js'

class Professor {
  constructor(name, rating) {
    this.name = name;
    this.rating = rating;
  }
}

class TableScraper {
  constructor() {
    this.rows =  document.getElementsByClassName("table table-striped section-summary")[0].rows
    this.lectureRows = {}
    this.lectureURLtoRowNum = {}
    this.ratings = {}
  }

  // True script found data for given lecture row
  isLectureRowWithData(rowNum) {
    return this.lectureRows[rowNum] != null
  }

  serializeLectureStats(rowNum) {
  let stat = this.lectureRows[rowNum]
  return `Name: ${stat.name}\n\
          Overall: ${stat.over_all}\n\
          Difficulty: ${stat.difficulty}\n\
          Would Take Again: ${stat.would_take_again}`
  }

  getLectureRowRating(i) {
    return this.lectureRows[i]
  }

  isLecture(i) {
    return this.rows[i].cells[2].innerText == "Lecture"
  }

  getLectureURL(i) {
    return this.rows[i].cells[1].getElementsByTagName('a')[0].href
  }

  htmlToElement(html) {
    return document.createRange().createContextualFragment(html)
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
    let profNameTableIndex = isLoggedIn() ? 3 : 2
    let profName = dom.querySelectorAll("table")[profNameTableIndex].rows[0].cells[1].innerText

    if (profName) {
      return flipName(profName)
    } else {
      throw "Name not in class page"
    }
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

  fetchProfName(lectureUrl) {
    return new Promise((resolve, reject) => {
      Fetcher.fetchDOM(lectureUrl)
        .then(dom => {
          let name = this.getProfNameFromDOM(dom)

          var lectureRowNum = this.lectureURLtoRowNum[lectureUrl]
          this.lectureRows[lectureRowNum] = name

          resolve(name)
        })
    })
  }

  getLectureProfNamesPromises() {
    return new Promise((resolve, reject) => {
      let promises = []
      Object.keys(this.lectureURLtoRowNum).map(lectureUrl => {
        promises.push(this.fetchProfName(lectureUrl))
      })
      resolve(promises)
    })
  }

  getProfRatingPromises(lectureFetchPromises) {
    let promises = []
    return new Promise((resolve, reject) => {
      Promise.all(lectureFetchPromises)
        .then(names => {
          let uniqueNames = Array.from(new Set(names))
          uniqueNames.map(name => {
            promises.push(new Promise((inner_resolve, reject) => {
              RMP.fetchProfRating(name)
                .then(rating => {
                  inner_resolve(new Professor(name, rating))
                })
            }))
          })
          resolve(promises)
        })
    })
  }

  fetchProfRatings() {
    return new Promise((resolve, reject) => {
      this.setLectureURLtoRowNum()
      this.getLectureProfNamesPromises()
        .then(lectureFetchPromises => {
          return this.getProfRatingPromises(lectureFetchPromises)
        })
        .then(rmpFetchPromises => {
          return Promise.all(rmpFetchPromises)
        })
        .then(ratings => {
          resolve(ratings)
        })
      })
  }

  getProfStatPromises(ratings) {
    return ratings.map(prof => {
      if (RMP.isValidProf(prof.rating)) {
        // Update rating to be prof obj
        let profObj = RMP.getProfObj(prof.rating)
        return RMP.fetchProfStats(profObj.pk_id)
      } else {
        // If prof profile not in RMP, set null
        Object.keys(this.lectureRows).map((i) => {
          if (this.lectureRows[i] == prof.name) {
            this.lectureRows[i] = null
          }
        })
      }
    })
  }

  setRatings() {
    return new Promise((resolve, reject) => {
      this.fetchProfRatings()
        .then(ratings => {
          let profStatPromises = this.getProfStatPromises(ratings)

          if (profStatPromises.length == 0) {
            // If no prof on RMP return on the spot
            resolve()
          } else {
            // If prof on RMP, scrape the stats
            Promise.all(profStatPromises)
              .then(stats => {
                const keys = Object.keys(this.lectureRows)
                // Make lecture Rows be {i: Professor}
                stats.map(stat => {
                  keys.map((i) => {
                    if (stat && this.lectureRows[i] == stat.name) {
                      this.lectureRows[i] = stat
                    }
                  })
                })
                resolve()
              })
            }
        })
    })
  }
}

export default new TableScraper()
