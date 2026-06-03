const { BasePO } = require("@ppb/wdio-lazy-element");
const { TEST_ID, RACE_VIEW_LINK_IMAGE, RACE_VIEW_LINK_TITLE } = require("./RaceViewLinkCard.web.selectors");

/**
 * Class that represents the Race View Link Card PO
 *
 */
module.exports = class RaceViewLinkCardPO extends BasePO {
  /**
   * Constructor for the  Race View Link Card PO
   * By default it sends the root element as lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get countryFlag() {
    return this.element.$(RACE_VIEW_LINK_IMAGE);
  }

  get venue() {
    return this.element.$(RACE_VIEW_LINK_TITLE);
  }
};
