import ProgressLines from './utils/ProgressLines.js'
import Tabs from './utils/Tabs.js'

const enterButton = document.getElementById('next-btn')

const progress = new ProgressLines(() =>
  enterButton.classList.remove('button--disabled')
)
const tabs = new Tabs()

let tabsCount = 0
const tabsElements = []

document
  .getElementById('tab-buttons')
  .querySelectorAll('.tabs__button')
  .forEach((btn) => {
    tabsCount++
    tabsElements.push({
      btn,
      clicked: false,
    })
  })

tabsElements.forEach((btn) => {
  btn.btn.addEventListener('click', (event) => {
    tabs.activeTab = +event.target.getAttribute('data-tab-button')
    // обработка прогресса
    if (!btn.clicked) {
      progress.value += oneTabValueForProgress
      btn.clicked = true
    }
  })
})

tabsElements[0].clicked = true

const oneTabValueForProgress = 100 / tabsCount

progress.value = oneTabValueForProgress
