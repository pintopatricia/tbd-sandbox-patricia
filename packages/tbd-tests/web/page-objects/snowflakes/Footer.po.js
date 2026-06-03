const {
  TEST_ID: SECTIONS,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/SectionElements/SectionElements.web.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/RegulatoryCard/snowflakes/Footer/Footer.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FooterPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the footer section elements
   * Uses the `SECTIONS` selector
   */
  get sections() {
    return this.element.$$(SECTIONS);
  }
}

module.exports = FooterPO;
