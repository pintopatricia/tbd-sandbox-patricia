const {
  TEST_ID,
  HEADER,
  CONTENT,
  RUNNER,
  VERDICT,
  VERDICT_LABEL,
} = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TimeformCardPO extends BasePO {
  /**
   * Creates a TimeformCard page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the header of the card
   * @return {HTMLElement} The header
   */
  get header() {
    return this.element.$(HEADER);
  }

  /**
   * Gets the content of the card
   * @return {HTMLElement} The content
   */
  get content() {
    return this.element.$(CONTENT);
  }

  /**
   * Gets the verdict label of the card
   * @return {HTMLElement} the verdict label
   */
  get verdictLabel() {
    return this.element.$(VERDICT_LABEL);
  }

  /**
   * Gets the verdict text of the card
   * @return {HTMLElement} the verdict text
   */
  get verdictText() {
    return this.element.$(VERDICT);
  }

  /**
   * Gets the runners of the card
   * @return {HTMLElement} The runners
   */
  get runners() {
    return this.element.$$(RUNNER);
  }
};
