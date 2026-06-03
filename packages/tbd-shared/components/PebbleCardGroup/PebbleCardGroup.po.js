const { BasePO } = require("@ppb/wdio-lazy-element");
const CARD_SELECTORS = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { TEST_ID, TITLE } = require("./PebbleCardGroup.web.selectors");

module.exports = class PebbleCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the multifunctional module title
   * @return {HTMLElement} The multifunctional module title
   */
  get title() {
    return this.element.$(TITLE);
  }

  get collapseTitle() {
    return this.element.$(CARD_SELECTORS.TITLE);
  }
};
