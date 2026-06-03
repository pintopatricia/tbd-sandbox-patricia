const { BasePO } = require("@ppb/wdio-lazy-element");
const { TITLE } = require("./SettingsPage.web.selectors");

module.exports = class SettingsPagePO extends BasePO {
  /**
   * Creates an settings page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    if (!lazyElement) {
      throw Error("SettingsPage selector is mandatory");
    }

    super(lazyElement);
  }

  /**
   * Gets the title
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(TITLE);
  }
};
