import Scraper from './tableScraper.js'
import Loader from './loader.js'
import Storage from './storage.js'

function isSubjectCoursePage() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('tname') == "subj-course"
}

function getCourseName() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('dept') + urlParams.get('course')
}

function setClass() {
  console.log(Scraper.lectureRows)
  Object.keys(Scraper.lectureRows).map(i => {
    // Add new if method here to check the state
    let sectionLinkElement = Scraper.rows[i].cells[1].children[0]
    if (Scraper.isLectureRowWithData(i)) {
      sectionLinkElement.classList.add('ubc-rmp-true')
      sectionLinkElement.setAttribute('tooltip', Scraper.serializeLectureStats(i))

      sectionLinkElement.addEventListener("mouseenter", (event) => {
      })
      sectionLinkElement.addEventListener("mouseleave", (event) => {
      })
    } else {
      sectionLinkElement.classList.add('ubc-rmp-false')
      sectionLinkElement.addEventListener("mouseenter", (event) => {
       })
      sectionLinkElement.addEventListener("mouseleave", (event) => {
      })
    }
  })
}

export function main() {
  // Abort if not in subject course page
  if (!isSubjectCoursePage) { return }

  const courseName = getCourseName()
  Loader.set()
  // Uncomment to test cache
  // Storage.remove(courseName)

  Storage.get(courseName)
    .then(lectureRows => {
      Loader.clear()
      Scraper.lectureRows = lectureRows
      setClass()
    })
    .catch(err => {
      Scraper.setRatings()
        .then(() => {
          Loader.clear()
          Storage.set({ [courseName]: Scraper.lectureRows })
          setClass()
        })
    })
}

