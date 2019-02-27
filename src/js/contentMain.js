import Scraper from './tableScraper.js'
// import Loader from './loader.js'
import Storage from './storage.js'
import RatingData from './ratingData.js'
import TooltipBuilder from './tooltipBuilder.js'

function isSubjectCoursePage() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('tname') == "subj-course"
}

// 1. Make it work in section index page
// 2. Make it work in individual section page

export function main() {
  // Abort if not in subject course page
  if (!isSubjectCoursePage) { return }

  // Loader.set()
  //   // Loader.clear()
  //     setClass()
  //     )

  let ratingData = new RatingData()
  let tooltipBuilder

  // Load JSON from local file
  ratingData.loadJSON()
    .then(data =>  {
      console.log(ratingData.ratingJSON[622532])
      tooltipBuilder = new TooltipBuilder(ratingData.courseJSON, ratingData.ratingJSON)
      tooltipBuilder.setTooltips()
    })
    .catch()
}

