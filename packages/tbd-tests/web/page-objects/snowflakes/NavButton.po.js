const { TEST_ID } = require("@ppb/tbd-shared/components/UserProfile/snowflakes/NavButton/NavButton.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class NavButtonPO extends BasePO {
  /**
   * Creates an NavButton page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    if (!lazyElement) {
      throw Error("NavButton selector is mandatory");
    }

    super(lazyElement, TEST_ID);
  }
};
