class DocElement {
  constructor() {}

  getWrapperDiv() {
    let wrapper = document.createElement("div");
    wrapper.setAttribute("class", "ubc-rmp-wrapper");
    return wrapper
  }

  getPElem(msg) {
    let elm = document.createElement("p")
    elm.innerText = msg
    return elm
  }

  getStatsPElem(text, stats) {
    let p = document.createElement('p')
    p.innerHTML = text + ` <b>${stats}</b>`
    return p
  }

  getLinkElem(txt, url) {
    let a = document.createElement('a')
    a.innerHTML = txt
    a.href = url
    a.target = "_blank"
    return a
  }
}

export default new DocElement()
