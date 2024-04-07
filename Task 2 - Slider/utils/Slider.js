export default class Slider {
  _nowSlide = 0

  constructor(
    options = {
      slidesContainerId: 'slides-container',
      slidesBtnsId: 'slides-btns',
    }
  ) {
    this._slidesContainer = document.getElementById(options.slidesContainerId)
    this._slidesBtnsContainer = document.getElementById(options.slidesBtnsId)

    this._slidesBtns =
      this._slidesBtnsContainer.querySelectorAll('[data-slide-num]')
    this._lastSlideNum = this._slidesBtns.length - 1
  }

  setSlide(number) {
    if (
      !Number.isInteger(number) ||
      number < 0 ||
      number > this._lastSlideNum
    ) {
      return
    }
    this._nowSlide = number
    this._slidesContainer.style.marginLeft = -number * 100 + '%'
  }

  prevSlide() {
    if (this._nowSlide < 0) {
      return
    }
    this.setSlide(this._nowSlide - 1)
  }

  nextSlide() {
    if (this._nowSlide > this._lastSlideNum) {
      return
    }
    this.setSlide(this._nowSlide + 1)
  }

  get slideNum() {
    return this._nowSlide
  }
}
