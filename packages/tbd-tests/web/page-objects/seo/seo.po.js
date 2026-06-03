const { BasePO } = require("@ppb/wdio-lazy-element");
const { META_STATUS_CODE, META_LOCATION, TEST_ID, META_DESCRIPTION } = require("./seo-selectors");

module.exports = class Seo extends BasePO {
  /**
   * Constructor for the old Betfair page PO
   * By default it sends the root element as lazyElement
   */
  constructor() {
    super($(TEST_ID));
  }

  get metaStatusCode() {
    return this.element.$(META_STATUS_CODE);
  }

  get metaLocation() {
    return this.element.$(META_LOCATION);
  }

  get metaDescription() {
    return this.element.$(META_DESCRIPTION);
  }
};
