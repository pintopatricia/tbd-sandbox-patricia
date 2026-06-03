const {
  TEST_ID,
  TEXT,
  TIME,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySectionsSession.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class RegulatorySectionsSessionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the footer session text element
   * Uses the `TEXT` selector
   */
  get text() {
    return this.element.$(TEXT);
  }

  /**
   * Returns the footer session time element
   * Uses the `TIME` selector
   */
  get time() {
    return this.element.$(TIME);
  }
}

module.exports = RegulatorySectionsSessionPO;
