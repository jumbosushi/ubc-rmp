import Scraper from './tableScraper.js'
import Loader from './loader.js'
import Storage from './storage.js'
import RatingData from './ratingData.js'

function isSubjectCoursePage() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('tname') == "subj-course"
}

function getCourseName() {
  let urlParams = new URLSearchParams(window.location.href)
  return urlParams.get('dept') + urlParams.get('course')
}

function getStatsP(text, stats) {
  let p = document.createElement('p')
  p.innerHTML = text + ` <b>${stats}</b>`
  return p
}

// Tippy.js need to receive the element that exist in DOM
function appendElmToTable(elm) {
  let table = document.getElementsByClassName('section-summary')[0]
  table.appendChild(elm)
}

// Wrapper div that is 'display: none' is required here since
// Tippy.js need to receive the element that exist in DOM
// Without wrapper, it would break the page layout
function appendTrueTemplate(templateId, profRating) {
  let wrapper = document.createElement("div");
  wrapper.setAttribute("class", "ubc-rmp-wrapper");
  let div = document.createElement("div");
  div.setAttribute("id", templateId);
  div.appendChild(getStatsP("Name:", profRating.name))
  div.appendChild(getStatsP("Overall:", profRating.over_all))
  div.appendChild(getStatsP("Difficulty:", profRating.difficulty))
  div.appendChild(getStatsP("Would Take Again:", profRating.would_take_again))
  wrapper.appendChild(div)
  appendElmToTable(wrapper)
}

function appendFalseTemplate(templateId) {
  let wrapper = document.createElement("div");
  wrapper.setAttribute("class", "ubc-rmp-wrapper");
  let div = document.createElement("div");
  div.setAttribute("id", templateId);
  let errorMsg = document.createElement("p")
  errorMsg.innerText = "Prof Data Not Found"
  div.appendChild(errorMsg)
  wrapper.appendChild(div)
  appendElmToTable(wrapper)
}

// Add tooltip template to all elements with .ubc-rmp-link class
function tippyAppendTemplate() {
  tippy('.ubc-rmp-link', {
    content: function (reference) {
      return document.getElementById(reference.getAttribute('data-template'))
    }
  })
}

function setClass() {
  Object.keys(Scraper.lectureRows).map(i => {
    let sectionLinkElement = Scraper.rows[i].cells[1].children[0]
    let templateId = `ubc-rmp-template-${i}`

    if (Scraper.isLectureRowWithData(i)) {
      sectionLinkElement.classList.add('ubc-rmp-link', 'ubc-rmp-true')
      sectionLinkElement.setAttribute("data-template", templateId)
      appendTrueTemplate(templateId, Scraper.getLectureRowRating(i))
    } else {
      sectionLinkElement.classList.add('ubc-rmp-link', 'ubc-rmp-false')
      sectionLinkElement.setAttribute("data-template", templateId)
    }
  })

  tippyAppendTemplate()
}

// 1. Make it work in section index page
// 2. Make it work in individual section page

export function main() {
  // Abort if not in subject course page
  if (!isSubjectCoursePage) { return }

  const courseName = getCourseName()
  const ratingData = new RatingData()
  ratingData.loadJSON()
    .then()
    .catch()
  console.log("<<<< main")
  console.log(ratingData.json[622532])
  // Loader.set()
  // Loader.clear()
  setClass()
}

