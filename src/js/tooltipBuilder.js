import CourseScraper from './courseScraper.js'
import SectionScraper from './sectionScraper.js'
import PageType from './pageType.js'
import DocElement from './docElement.js'

class TooltipBuilder {

  constructor(courseJSON, ratingJSON) {
    // Ex:
    // {
    //   "AANB": {
    //     "500": {},
    //     "527": {
    //        "001": [
    //            1486659,
    //            1483252
    //        ]
    //      },
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

  getInstrIDs(section) {
    let urlParams = new URLSearchParams(window.location.href)
    let dept = urlParams.get('dept')
    let course = urlParams.get('course')
    return this.courseToInstr[dept][course][section]
  }

  getRatings(section) {
    let instrIDs = this.getInstrIDs(section)

    if (instrIDs == undefined) {
      return []
    }
    return instrIDs.map(ubcid => this.instrToRating[ubcid])
  }

  getRMPProfileLink(profID) {
    let baseURL = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid="
    return baseURL + profID
  }

  getProfStat(section) {
    let ratings = this.getRatings(section)
    let formattedRatings = []

    ratings.forEach(rating => {
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
        rmpid:             rating.rmpid,
        url:               this.getRMPProfileLink(rating.rmpid)
      }

      formattedRatings.push(result)
    })

    return formattedRatings
  }

  // Tippy.js need to receive the element that exist in DOM
  appendElmToTable(elm) {
    // let table = document.getElementsByClassName('section-summary')[0]
    document.body.appendChild(elm)
  }

  // Wrapper div that is 'display: none' is required here since
  // Tippy.js need to receive the element that exist in DOM
  // Without wrapper, it would break the page layout
  appendSuccessTemplate(templateId, profRating, extraProfCount) {
    let wrapper = DocElement.getWrapperDiv()
    let div = document.createElement("div");
    div.setAttribute("id", templateId);
    div.appendChild(DocElement.getLinkElem(profRating.name, profRating.url))
    div.appendChild(DocElement.getStatsPElem("Overall:", profRating.over_all))
    div.appendChild(DocElement.getStatsPElem("Difficulty:", profRating.difficulty))
    div.appendChild(DocElement.getStatsPElem("Would Take Again:", profRating.would_take_again))
    // Add the message at the bottom for courses index
    if (extraProfCount > 0) {
      let profNoun = (extraProfCount == 1) ? 'prof' : 'profs'
      let extraProfMsg = DocElement.getPElem(`+ ${extraProfCount} other ${profNoun}`)
      extraProfMsg.classList.add('extra-prof-msg')
      div.appendChild(extraProfMsg)
    }
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  appendNoneSectionTemplate(templateID) {
    let wrapper = DocElement.getWrapperDiv()
    let div = document.createElement("div");
    div.setAttribute("id", templateID);
    let errorMsg = DocElement.getPElem("No prof with ratings in this section :(")
    div.appendChild(errorMsg)
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  appendNoReviewTemplate(templateID, profRating) {
    let wrapper = DocElement.getWrapperDiv()
    let div = document.createElement("div");
    div.setAttribute("id", templateID);
    let errorMsg = DocElement.getPElem("This prof doesn't have any reviews :(")
    let callToAction = DocElement.getLinkElem("Add a review", profRating.url)
    div.appendChild(errorMsg)
    div.appendChild(callToAction)
    wrapper.appendChild(div)
    this.appendElmToTable(wrapper)
  }

  appendNoProfileTemplate(templateID) {
    let wrapper = DocElement.getWrapperDiv()
    let div = document.createElement("div");
    div.setAttribute("id", templateID);
    let errorMsg = DocElement.getPElem("This prof doesn't have a profile :(")
    let newProfileLink = "https://www.ratemyprofessors.com/teacher/create"
    let callToAction = DocElement.getLinkElem("Add a new prof profile", newProfileLink)
    div.appendChild(errorMsg)
    div.appendChild(callToAction)
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
      theme: "dark-blue",
    })
  }

  haveRating(profRating) {
    return profRating.difficulty != 0
  }

  haveRMPProfile(profRating) {
    return profRating.rmpid != 0
  }

  addTooltip(element, templateID, profRating, profNames, isCourse) {
      if (this.haveRating(profRating)) {
        element.classList.add('ubc-rmp-link', 'ubc-rmp-true')
        element.setAttribute("data-template", templateID)
        this.appendSuccessTemplate(templateID, profRating, profNames)
      } else {
        element.classList.add('ubc-rmp-link', 'ubc-rmp-false')
        element.setAttribute("data-template", templateID)
        if (isCourse) {
          this.appendNoneSectionTemplate(templateID)
        } else {
          if (this.haveRMPProfile(profRating)) {
            this.appendNoReviewTemplate(templateID, profRating)
          } else {
            this.appendNoProfileTemplate(templateID)
          }
        }
      }
  }

  getBestRating(profRatings) {
    // Index for which rating to show in course index page
    let ratingIndex = 0
    let bestRating = profRatings[ratingIndex]

    for (let i = 1; i < profRatings.length; i++) {
      let curRating = profRatings[i]
      if (curRating.over_all > bestRating.over_all) {
        ratingIndex = i
      }
    }

    return profRatings[ratingIndex]
  }

  setCourseTooltips() {
    let lectureRows = CourseScraper.getLectureRows()

    Object.keys(lectureRows).map(rowNum => {
      let sectionLinkElement = CourseScraper.rows[rowNum].cells[1].children[0]
      let templateID = `ubc-rmp-template-${rowNum}`
      let profRatings = this.getProfStat(lectureRows[rowNum])

      // In current scrpaer implementation, profRatings == []
      // when type is "Lectures" but taught only by TA's
      if (profRatings.length === 0) {
        return
      }

      // Choose the best out of the lecture instructors
      let bestRating = this.getBestRating(profRatings)
      let extraProfCount = profRatings.length - 1

      this.addTooltip(sectionLinkElement, templateID, bestRating, extraProfCount, true)
    })

    this.tippyAppendTemplate()
  }

  setSectionTooltips() {
    let id = 1
    let instrLinkElements = SectionScraper.getInstrLinkElement()
    let section = SectionScraper.section
    let profRatings = this.getProfStat(section)

    profRatings.forEach((profRating, i) => {
      let templateID = `ubc-rmp-template-${id}`
      this.addTooltip(instrLinkElements[i], templateID, profRating, 0, false)
      id++
    })
    this.tippyAppendTemplate()
  }
}

export default TooltipBuilder
