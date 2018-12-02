class RateMyProf {
  getProfNameSearchUrl(name) {
    return `https://search.mtvnservices.com/typeahead/suggest/?solrformat=true&rows=20&callback=noCB&q=${name}&defType=edismax&qf=teacherfirstname_t^2000+teacherlastname_t^2000+teacherfullname_t^2000+autosuggest&bf=pow(total_number_of_ratings_i,1.7)&sort=score+desc&siteName=rmp&group=on&group.field=content_type_s&group.limit=20`
  }

  htmlToElement(html) {
    return document.createRange().createContextualFragment(html)
  }

  corsFetch(url, method) {
    const urlProxy = 'https://cors-anywhere.herokuapp.com/'
    const requestURL = urlProxy + url
    return new Promise((resolve, reject) => {
     fetch(requestURL, {
        method: method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
        }
      })
      .then(res => {
        return res.text()
      })
      .then(res_in_str => {
        resolve(res_in_str)
      })
      .catch(err => {
        reject(err)
      })
    })
  }

  fetchProfRating(name) {
    return new Promise((resolve, reject) => {
      // Go through proxy to overcome chrome extension CORS policy
      const searchUrl = this.getProfNameSearchUrl(name)
      this.corsFetch(searchUrl, 'GET')
        .then(res_in_str => {
          resolve(this.rmpStrToJson(res_in_str))
        })
    })
  }

  // Returned response usually have noCM({ ...  }) at the beginning & end
  rmpStrToJson(str) {
    return JSON.parse(str.substring(5, str.length-2))
  }

  isProfOnRmp(payload) {
    return payload['grouped']['content_type_s']['groups'].length > 0
  }

  isUBCProf(profObj) {
    const SCHOOL_NAME = 'University of British Columbia'
    return profObj['schoolname_s'] === SCHOOL_NAME
  }

  isValidProf(payload) {
    if (!this.isProfOnRmp(payload)) {
      return false
    }

    let profs = payload['grouped']['content_type_s']['groups'][0]['doclist']['docs']
    let validProf = profs.filter(profObj => this.isUBCProf(profObj))
    // True is the record is there
    return validProf.length > 0
  }

  getProfObj(payload) {
    let profs = payload['grouped']['content_type_s']['groups'][0]['doclist']['docs']
    // TODO: Cover the edge case when there's two same UBC prof with the same name
    let validProf = profs.filter(profObj => this.isUBCProf(profObj))
    return validProf[0]
  }

  fetchProfStats(profId) {
    return new Promise((resolve, reject) => {
      let profUrl = `https://www.ratemyprofessors.com/ShowRatings.jsp?tid=${profId}`
      this.corsFetch(profUrl, 'GET')
        .then(res_in_str => {
          resolve(this.getProfStat(res_in_str, profUrl))
        })
    })
  }

  getProfStat(html, profUrl) {
    const dom = this.htmlToElement(html)
    let first = dom.querySelector(".pfname").innerText.trim().toUpperCase()
    let last = dom.querySelector(".plname").innerText.trim().toUpperCase()
    const name = `${first} ${last}`
    const ratingBreakdown = dom.querySelectorAll(".rating-breakdown")[0]
    const grades = ratingBreakdown.querySelectorAll(".grade")
    return {
      name: name,
      over_all: grades[0].innerText.trim(),
      would_take_again: grades[1].innerText.trim(),
      difficulty: grades[2].innerText.trim(),
      url: profUrl
    }
  }
}

export default RateMyProf
