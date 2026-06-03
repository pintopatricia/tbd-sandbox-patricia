const { BasePO } = require("@ppb/wdio-lazy-element");
const appDesktop = require("./app-desktop.json");

const ROOT_ID = "[id$=root]";

module.exports = class LanguageDropdown extends BasePO {
  /**
   * Creates an backToCurrent page object instance
   * @param {LazyElement} lazyElement
   */

  constructor(lazyElement) {
    super(lazyElement, $(ROOT_ID));
  }

  get dropdownButton() {
    return this.element.$(appDesktop.dropdown);
  }

  get sportsBook() {
    return this.element.$(appDesktop.sportsBook);
  }

  async openDropdown() {
    await this.dropdownButton.click();
  }

  async selectLanguageByName(languageCode) {
    await this.dropdownButton.click();
    const languageOption = await $(`${appDesktop.languageFirstPart}${languageCode}`);
    await languageOption.waitForDisplayed();
    await languageOption.click();
  }
};
