const { TEST_ID, BADGE_TEXT, ROULETTE_NUMBER } = require("@ppb/the-wall-web/components/walls/Badge/Badge.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class BadgePo extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get badgeText() {
    return this.element.$(BADGE_TEXT);
  }

  /**
   * Gets the roulette number
   * @return {HTMLElement} The roulette number
   */
  get rouletteNumbers() {
    return this.element.$$(ROULETTE_NUMBER);
  }
};
