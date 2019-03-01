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
}

export default new PageType()
