const {
  STARS,
  STAR_FILLED,
  STAR_OUTLINE,
} = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/snowflakes/TimeformCard/snowflakes/Stars/Stars.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class StarsPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STARS}`));
  }

  /**
   * Gets the filled stars
   * @return {HTMLElement} The filled stars
   */
  get filledStars() {
    return this.element.$$(`~${STAR_FILLED}`);
  }

  /**
   * Gets the outline stars
   * @return {HTMLElement} The outline stars
   */
  get outlineStars() {
    return this.element.$$(`~${STAR_OUTLINE}`);
  }
};
