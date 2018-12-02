import RateMyProf from './rmp.js'
const RMP = new RateMyProf()

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
    this.ratings = {}
  }

  isLecture(i) {
    return this.rows[i].cells[2].innerText == "Lecture"
  }

  getLectureURL(i) {
    return this.rows[i].cells[1].getElementsByTagName('a')[0].href
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

    let profName = dom.querySelectorAll("table")[2].rows[0].cells[1].innerText

    if (profName) {
      return flipName(profName)
    } else {
      throw "Name not in class page"
    }
  }

  getLecturProfNamesPromises() {
    return new Promise((resolve, reject) => {
      let promises = []
      for (var i = 1; i < this.rows.length; i++) {
        if (this.isLecture(i)) {
          const lectureUrl = this.getLectureURL(i)
          // Temp save url and i
          // This is because Promise won't let i be saved in its instance
          this.lectureRows[lectureUrl] = i

          promises.push(new Promise((inner_resolve, inner_reject) => {
            this.fetchPageHTML(lectureUrl)
              .then(html => {
                const dom = this.htmlToElement(html)
                let name = this.getProfNameFromDOM(dom)

                // TODO: Change this hacky solution
                // Change so that lectureRows will be {i: name}
                var temp_i = this.lectureRows[lectureUrl]
                delete this.lectureRows[lectureUrl]
                this.lectureRows[temp_i] = name

                console.log("DONE 1")

                inner_resolve(this.getProfNameFromDOM(dom))
              })
          }))
        }
      }
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
          console.log("DONE 2")
          resolve(promises)
        })
    })
  }

  fetchProfRatings() {
    return new Promise((resolve, reject) => {
      this.getLecturProfNamesPromises()
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

  setRatings() {
    return new Promise((resolve, reject) => {
      this.fetchProfRatings()
        .then(ratings => {
          let profStatPromises = []

          ratings.map(prof => {
            if (RMP.isValidProf(prof.rating)) {
              // Update rating to be prof obj
              let profObj = RMP.getProfObj(prof.rating)
              profStatPromises.push(RMP.fetchProfStats(profObj.pk_id))
            } else {
              // If prof profile not in RMP, set null
              Object.keys(this.lectureRows).map((i) => {
                if (this.lectureRows[i] == prof.name) {
                  this.lectureRows[i] = null
                }
              })
            }
          })

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
                    if (this.lectureRows[i] == stat.name) {
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

export default TableScraper
