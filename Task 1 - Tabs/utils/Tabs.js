export default class Tabs {
  _activeTab = 1
  constructor(
    buttonsContainerId = 'tab-buttons',
    tabsContentContainerId = 'tab-items',
    activeButtonClassName = 'tabs__button--active'
  ) {
    const buttonsContainer = document.getElementById(buttonsContainerId)
    this._buttons = buttonsContainer.querySelectorAll('[data-tab-button]')

    const tabsContentContainer = document.getElementById(tabsContentContainerId)
    this._tabsElements =
      tabsContentContainer.querySelectorAll('[data-tab-item]')

    this._activeButtonClassName = activeButtonClassName

    this._setActiveTab(this._activeTab)
  }

  set activeTab(value) {
    if (!Number.isInteger(value) || value < 1) {
      return
    }
    this._activeTab = value
    this._setActiveTab(value)
  }
  
  get activeTab() {
    return this._activeTab
  }

  _setActiveTab(value = 1) {
    this._buttons.forEach((btn) => {
      +btn.getAttribute('data-tab-button') === value
        ? btn.classList.add(this._activeButtonClassName)
        : btn.classList.remove(this._activeButtonClassName)
    })

    this._tabsElements.forEach((elem) => {
      +elem.getAttribute('data-tab-item') <= value
        ? elem.style.display = "block"
        : elem.style.display = "none"
    })
  }
}
