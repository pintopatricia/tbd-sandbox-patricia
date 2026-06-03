const {
  TEST_ID,
  TITLE,
} = require("@ppb/tbd-shared/components/BrowsePage/snowflakes/SectionHeader/SectionHeader.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SectionHeaderPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the search overlay title
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }
}

module.exports = SectionHeaderPO;
