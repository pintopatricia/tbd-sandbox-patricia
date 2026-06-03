const {
  TEST_ID,
  TITLE,
  SUBTITLE,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/PromotionCard/snowflakes/PromotionTitles/PromotionTitles.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromotionTitlesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the title element
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Returns the subtitle element
   * Uses the `SUBTITLE` selector
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }
}

module.exports = PromotionTitlesPO;
