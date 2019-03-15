class PageType {
  constructor() {
    this.urlParams = new URLSearchParams(window.location.href)
  }

  checkURLParam(param) {
    return this.urlParams.get('tname') === param
  }

  isSubjectCoursePage() {
    return this.checkURLParam("subj-course")
  }

  isSectionPage() {
    return this.checkURLParam("subj-section")
  }

  isAllowedPage() {
    return this.isSubjectCoursePage() || this.isSectionPage()
  }

  // Return which year, term, and campus the current page is for
  getJSONPrefix() {
    let btnGroup = document.querySelectorAll(".pull-right .btn-group .btn-primary")

    let campusText = btnGroup[0].textContent
    let yearTermText = btnGroup[2].textContent

    let campus = (campusText.includes("Vancouver")) ? "UBC" : "UBCO"
    // Ex. 2019
    let year = yearTermText.split(' ')[1]
    // Get the capital letter of the term (Ex. "Summer" => "S")
    let term = yearTermText.split(' ')[2].substring(0, 1)

    return `${year}_${term}_${campus}_`
  }
}

export default new PageType()
