class Storage {
  isEmptyObject(objectInput) {
     for ( name in objectInput) {
       return false;
     }
     return true;
  }

  set(obj) {
    // {key: value}
    chrome.storage.local.set(obj)
  }

  get(keyStr) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([keyStr], (result) => {
        if (this.isEmptyObject(result)) { reject("No cache found") }

        Object.keys(result).map(key => {
          console.log(result[key])
          resolve(result[key])
        })
      })
    })
  }

  remove(keyStr) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keyStr, () => {
        console.log(`${keyStr} deleted!`)
        resolve()
      })
    })
  }
}

export default new Storage()
