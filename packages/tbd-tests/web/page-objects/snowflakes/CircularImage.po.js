const {
  TEST_ID,
  IMAGE,
  TEXT,
} = require("@ppb/tbd-shared/components/CompetitionViewLinkCard/snowflakes/CircularImage/CircularImage.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CircularImagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the logo
   * Uses the `IMAGE` selector
   */
  get image() {
    return this.element.$(IMAGE);
  }

  /**
   * Returns the text
   * Uses the `TEXT` selector
   */
  get text() {
    return this.element.$(TEXT);
  }
}

module.exports = CircularImagePO;
