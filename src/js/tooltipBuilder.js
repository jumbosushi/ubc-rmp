import Scraper from './tableScraper.js'

class TooltipBuilder {

  constructor(courseJSON, ratingJSON) {
    // Ex:
    // {
    //   "AANB": {
    //     "500": {},
    //     "504": {
    //         "002": 1310500
    //     }
    // }
    this.courseToInstr = courseJSON

    // Ex:
    // "1009612": {
    //   "difficulty":       2.3,
    //   "name":             "FRANCOIS, ROGER",
    //   "overall":          3.5,
    //   "rmpid":            797936,
    //   "ubcid":            1009612,
    //   "would_take_again":  "75%"
    // }
    this.instrToRating = ratingJSON
  }

  getInstrID(section) {
    let urlParams = new URLSearchParams(window.location.href)
    let dept = urlParams.get('dept')
    let course = urlParams.get('course')
    return this.courseToInstr[dept][course][section]
  }

  getRating(section) {
    let instrID = this.getInstrID(section)
    return this.instrToRating[instrID]
  }

  getRMPProfileLink(profID) {
    let baseURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="
    return baseURL + profID
  }

  getProfStat(section) {
    let rating = this.getRating(section)

    let would_take_again_str
    // Switch used here to handle either when str is empty or "N/A"
    switch (rating.would_take_again) {
      case "":
        would_take_again_str = "Unknown"
        break
      case "N/A":
        would_take_again_str = "N/A"
        break
      default:
        would_take_again_str = rating.would_take_again
    }

    let result = {
      name:              rating.name,
      over_all:          rating.overall,
      would_take_again:  would_take_again_str,
      difficulty:        rating.difficulty,
      url:               this.getRMPProfileLink(rating.rmpid)
    }

    return result
  }

  getStatsP(text, stats) {
    let p = document.createElement('p')
    p.innerHTML = text + ` <b>${stats}</b>`
    return p
  }

  // Tippy.js need to receive the element that exist in DOM
  appendElmToTable(elm) {
    let table = document.getElementsByClassName('section-summary')[0]
    table.appendChild(elm)
  }

  // Wrapper div that is 'display: none' is required here since
  // Tippy.js need to receive the element that exist in DOM
  // Without wrapper, it would break the page layout
  appendTrueTemplate(templateId, profRating) {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "ubc-rmp-wrapper");
    let div = document.createElement("div");
    div.setAttribute("id", templateId);
    div.appendChild(this.getStatsP("Name:", profRating.name))
    div.appendChild(this.getStatsP("Overall:", profRating.over_all))
    div.appendChild(this.getStatsP("Difficulty:", profRating.difficulty))
    div.appendChild(this.getStatsP("Would Take Again:", profRating.would_take_again))
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  appendFalseTemplate(templateId) {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "ubc-rmp-wrapper");
    let div = document.createElement("div");
    div.setAttribute("id", templateId);
    let errorMsg = document.createElement("p")
    errorMsg.innerText = "Prof Data Not Found"
    div.appendChild(errorMsg)
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  // Add tooltip template to all elements with .ubc-rmp-link class
  tippyAppendTemplate() {
    tippy('.ubc-rmp-link', {
      content: function (reference) {
        return document.getElementById(reference.getAttribute('data-template'))
      }
    })
  }

  setTooltips() {
    let lectureRows = Scraper.getLectureRows()

    Object.keys(lectureRows).map(rowNum => {
      let sectionLinkElement = Scraper.rows[rowNum].cells[1].children[0]
      let templateId = `ubc-rmp-template-${rowNum}`

      if (Scraper.isLectureRowWithData(rowNum)) {
        sectionLinkElement.classList.add('ubc-rmp-link', 'ubc-rmp-true')
        sectionLinkElement.setAttribute("data-template", templateId)
        let ratingObj = this.getProfStat(lectureRows[rowNum])
        this.appendTrueTemplate(templateId, ratingObj)
      } else {
        sectionLinkElement.classList.add('ubc-rmp-link', 'ubc-rmp-false')
        sectionLinkElement.setAttribute("data-template", templateId)
      }
    })

    this.tippyAppendTemplate()
  }
}

export default TooltipBuilder
