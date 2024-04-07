export default class ProgressLines {
  // Подойдет для двух связаных прогресс-линий
  constructor(
    fullProgressHandler = () => {},
    progressLineId = 'progress-line'
  ) {
    this.progressLine = document.getElementById(progressLineId)
    this.fullProgressHandler = fullProgressHandler

    this._progressValue = 0 // В процентах
    this._setProgressOnLines(this._progressValue)
  }

  _setProgressOnLines(value) {
    this.progressLine.style.width = value + '%'
    if (this._progressValue === 100) {
      this.fullProgressHandler()
    }
  }

  set value(progressValue = 0) {
    if (
      !Number.isInteger(progressValue) ||
      progressValue < 0 ||
      progressValue > 100
    ) {
      return
    }
    this._progressValue = progressValue
    this._setProgressOnLines(progressValue)
  }

  get value() {
    return this._progressValue
  }
}
