import Loader from './loader.js'
import RatingData from './ratingData.js'
import TooltipBuilder from './tooltipBuilder.js'

function checkURLParam(param) {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('tname') === param
}

function isSubjectCoursePage() {
  return checkURLParam("subj-course")
}

function isSectionPage() {
  return checkURLParam("subj-section")
}

// [X] Make it work in section index page
// [ ] Make it work in individual section page

export function main() {
  // Abort if not in subject course page
  if (!isSubjectCoursePage() && !isSectionPage()) { return }

  Loader.set()

  let ratingData = new RatingData()
  let tooltipBuilder

  // Load JSON from local file
  ratingData.loadJSON()
    .then(data =>  {
      tooltipBuilder = new TooltipBuilder(ratingData.courseJSON, ratingData.ratingJSON)
      tooltipBuilder.setTooltips()
      Loader.clear()
    })
    .catch(err => console.error(err))
}

