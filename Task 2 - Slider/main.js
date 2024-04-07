import ProgressLines from './utils/ProgressLines.js'
import Slider from './utils/Slider.js'

const enterButton = document.getElementById('next-btn')
const progress = new ProgressLines(() =>
  enterButton.classList.remove('button--disabled')
)
const slider = new Slider()

const slidesBtns = document
  .getElementById('slides-btns')
  .querySelectorAll('[data-slide-num]')

const oneStapProgressValue = 100 / slidesBtns.length
progress.value = oneStapProgressValue

const slidesChecked = [0] // example: [0,2, 4]

function setNowSlideBtn(num) {
  slidesBtns.forEach((btn) => {
    btn.classList.remove('slider__slides-btn--active')
  })
  slidesBtns[num].classList.add('slider__slides-btn--active')
  // For progress
  if (!slidesChecked.includes(num)) {
    progress.value += oneStapProgressValue
    slidesChecked.push(num)
  }
}

slidesBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const buttonNum = +event.target.getAttribute('data-slide-num') - 1
    slider.setSlide(buttonNum)
    setNowSlideBtn(buttonNum)
  })
})

document.getElementById('prev-slide-btn').addEventListener('click', () => {
  slider.prevSlide()
  setNowSlideBtn(slider.slideNum)
})

document.getElementById('next-slide-btn').addEventListener('click', () => {
  slider.nextSlide()
  setNowSlideBtn(slider.slideNum)
})
