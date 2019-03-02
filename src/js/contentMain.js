import Loader from './loader.js'
import RatingData from './ratingData.js'
import TooltipBuilder from './tooltipBuilder.js'
import PageType from './pageType.js'

export function main() {
  if (!PageType.isAllowedPage()) { return }

  Loader.set()

  let ratingData = new RatingData()
  let tooltipBuilder

  // Load JSON from local file
  ratingData.loadJSON()
    .then(data =>  {
      tooltipBuilder = new TooltipBuilder(ratingData.courseJSON, ratingData.ratingJSON)
      if (PageType.isSubjectCoursePage()) {
        tooltipBuilder.setCourseTooltips()
      } else {
        tooltipBuilder.setSectionTooltips()
      }
      Loader.clear()
    })
    .catch(err => console.error(err))
}

