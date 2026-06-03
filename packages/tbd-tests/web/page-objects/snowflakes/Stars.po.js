const {
  TEST_ID,
  STAR_FILLED,
  STAR_OUTLINE,
} = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/snowflakes/TimeformCard/snowflakes/Stars/Stars.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class StarsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the filled stars
   * @return {HTMLElement} The filled stars
   */
  get filledStars() {
    return this.element.$$(STAR_FILLED);
  }

  /**
   * Gets the outline stars
   * @return {HTMLElement} The outline stars
   */
  get outlineStars() {
    return this.element.$$(STAR_OUTLINE);
  }
};
