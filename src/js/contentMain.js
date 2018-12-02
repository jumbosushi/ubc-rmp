import TableScraper from "./tableScraper.js"
const Scraper = new TableScraper()

export function main() {
  // Do what you want
  // Add pop up
  Scraper.setRatings()
    .then(() => {
      Object.keys(Scraper.lectureRows).map(i => {
        let cell = Scraper.rows[i].cells[2]
        if (Scraper.lectureRows[i] != null) {
          cell.classList.add('ubc-rmp-true')
          cell.addEventListener("mouseenter", (event) => {
            // show pop up
          })
          cell.addEventListener("mouseleave", (event) => {
          })
        } else {
          cell.classList.add('ubc-rmp-false')
          cell.addEventListener("mouseenter", (event) => {
            // show pop up
           })
          cell.addEventListener("mouseleave", (event) => {
            // hide pop up
          })
        }
      })
    })
}

