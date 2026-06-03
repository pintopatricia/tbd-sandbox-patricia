const {
  TEST_ID,
  AET,
  PEN,
  ICON,
  FORM_CONTAINER,
  FORM_DATE,
  FORM_OPPONENT_NAME,
  FORM_PENALTIES_SCORE,
  FORM_SCORE,
} = require("@ppb/tbd-shared/components/RecentFormCard/snowflakes/RecentFormResult/RecentFormResult.web.selectors");
const styles = require("@ppb/tbd-shared/components/RecentFormCard/snowflakes/RecentFormResult/RecentFormResult.web.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentFormResultPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get resultAlignments() {
    return {
      RIGHT: styles.right.replace(".", ""),
      LEFT: styles.left.replace(".", ""),
    };
  }

  /**
   * Gets the RecentFormResult
   * @return {HTMLElement} RecentFormResult container
   */
  get container() {
    return this.element.$(FORM_CONTAINER);
  }

  /**
   * Gets the RecentFormResult Icon
   * @return {HTMLElement} RecentFormIcon
   */
  get icon() {
    return this.element.$(ICON);
  }

  /**
   * Gets the RecentFormResult score
   * @return {HTMLElement} RecentFormResult score
   */
  get score() {
    return this.element.$(FORM_SCORE);
  }

  /**
   * Gets the RecentFormResult date
   * @return {HTMLElement} RecentFormResult date
   */
  get date() {
    return this.element.$(FORM_DATE);
  }

  /**
   * Gets the RecentFormResult opponent`s name
   * @return {HTMLElement} RecentFormResult opponent`s name
   */
  get opponent() {
    return this.element.$(FORM_OPPONENT_NAME);
  }

  /**
   * Gets the penalties score
   * @return {HTMLElement} RecentFormResult penalties score
   */
  get scorePenalties() {
    return this.element.$(FORM_PENALTIES_SCORE);
  }

  /**
   * Gets the AET element
   * @return {HTMLElement} RecentFormResult AET if present
   */
  get AET() {
    return this.element.$(AET);
  }

  /**
   * Gets the penalties P label
   * @return {HTMLElement} RecentFormResult P if present
   */
  get pen() {
    return this.element.$(PEN);
  }
};
