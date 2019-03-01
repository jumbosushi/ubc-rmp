import CourseScraper from './courseScraper.js'
import SectionScraper from './sectionScraper.js'
import PageType from './pageType.js'

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

  getProfLink(name, url) {
    let a = document.createElement('a')
    a.innerHTML = name
    a.href = url
    return a
  }

  // Tippy.js need to receive the element that exist in DOM
  appendElmToTable(elm) {
    // let table = document.getElementsByClassName('section-summary')[0]
    document.body.appendChild(elm)
  }

  // Wrapper div that is 'display: none' is required here since
  // Tippy.js need to receive the element that exist in DOM
  // Without wrapper, it would break the page layout
  appendTrueTemplate(templateId, profRating) {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "ubc-rmp-wrapper");
    let div = document.createElement("div");
    div.setAttribute("id", templateId);
    div.appendChild(this.getProfLink(profRating.name, profRating.url))
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
    errorMsg.innerText = "Prof Rating Not Found"
    div.appendChild(errorMsg)
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  // Add tooltip template to all elements with .ubc-rmp-link class
  tippyAppendTemplate() {
    tippy('.ubc-rmp-link', {
      content: function (reference) {
        return document.getElementById(reference.getAttribute('data-template'))
      },
      // Keep tooltip if hovered
      interactive: true,
      placement: "right",
      arrow: true,
      arrowType: "round",
    })
  }

  haveRating(profRating) {
    return profRating.difficulty != 0
  }

  addTooltip(element, templateID, profRating) {
      if (this.haveRating(profRating)) {
        element.classList.add('ubc-rmp-link', 'ubc-rmp-true')
        element.setAttribute("data-template", templateID)
        this.appendTrueTemplate(templateID, profRating)
      } else {
        element.classList.add('ubc-rmp-link', 'ubc-rmp-false')
        element.setAttribute("data-template", templateID)
        this.appendFalseTemplate(templateID)
      }
  }

  setTooltips() {
    let lectureRows = CourseScraper.getLectureRows()

    Object.keys(lectureRows).map(rowNum => {
      let sectionLinkElement = CourseScraper.rows[rowNum].cells[1].children[0]
      let templateID = `ubc-rmp-template-${rowNum}`
      let profRating = this.getProfStat(lectureRows[rowNum])

      this.addTooltip(sectionLinkElement, templateID, profRating)
    })

    this.tippyAppendTemplate()
  }

  setSectionTooltips() {
    let instrLinkElement = SectionScraper.getInstrLinkElement()
    let templateID = `ubc-rmp-template-1`
    let section = SectionScraper.section
    let profRating = this.getProfStat(section)

    this.addTooltip(instrLinkElement, templateID, profRating)
    this.tippyAppendTemplate()
  }
}

export default TooltipBuilder
