import Loader from './loader.js'
import RatingData from './ratingData.js'
import TooltipBuilder from './tooltipBuilder.js'
import PageType from './pageType.js'


// [X] Make it work in section index page
// [ ] Make it work in individual section page

export function main() {
  // Abort if not in subject course page
  if (!PageType.isAllowedPage()) { return }

  Loader.set()

  let ratingData = new RatingData()
  let tooltipBuilder

  // Load JSON from local file
  ratingData.loadJSON()
    .then(data =>  {
      tooltipBuilder = new TooltipBuilder(ratingData.courseJSON, ratingData.ratingJSON)
      if (PageType.isSubjectCoursePage()) {
        tooltipBuilder.setTooltips()
      } else {
        tooltipBuilder.setSectionTooltips()
      }
      Loader.clear()
    })
    .catch(err => console.error(err))
}

