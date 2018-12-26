import Scraper from './tableScraper.js'
import Loader from './loader.js'

function isSubjectCoursePage() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('tname') == "subj-course"
}

export function main() {
  // Abort if not in subject course page
  if (!isSubjectCoursePage) { return }

  Loader.set()

  Scraper.setRatings()
    .then(() => {
      Loader.clear()
      Object.keys(Scraper.lectureRows).map(i => {
        // Add new if method here to check the state
        let sectionLinkElement = Scraper.rows[i].cells[1].children[0]
        if (Scraper.isLectureRowWithData(i)) {
          sectionLinkElement.classList.add('ubc-rmp-true')
          sectionLinkElement.setAttribute('tooltip', Scraper.serializeLectureStats(i))

          sectionLinkElement.addEventListener("mouseenter", (event) => {
            // show pop up
          })
          sectionLinkElement.addEventListener("mouseleave", (event) => {
          })
        } else {
          sectionLinkElement.classList.add('ubc-rmp-false')
          sectionLinkElement.addEventListener("mouseenter", (event) => {
            // show pop up
           })
          sectionLinkElement.addEventListener("mouseleave", (event) => {
            // hide pop up
          })
        }
      })
    })
    .catch(e => {
      // TODO: Make text red + add error msg
      Loader.clear()
    })
}

