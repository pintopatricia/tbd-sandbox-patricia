const {
  TIMEFORM_CARD,
  TIMEFORM_CARD_HEADER,
  TIMEFORM_CARD_CONTENT,
  TIMEFORM_CARD_RUNNER_RATING,
  TIMEFORM_CARD_RUNNER_RATING_TEXT,
  TIMEFORM_CARD_VERDICT_LABEL,
  TIMEFORM_CARD_VERDICT_TEXT,
} = require("@ppb/tbd-shared/components/TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class TimeformCardPO extends BaseSO {
  /**
   * Creates a TimeformCard page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIMEFORM_CARD}`));
  }

  /**
   * Gets the header of the card
   * @return {HTMLElement} The header
   */
  get header() {
    return this.element.$(`~${TIMEFORM_CARD_HEADER}`);
  }

  /**
   * Gets the content of the card
   * @return {HTMLElement} The content
   */
  get content() {
    return this.element.$(`~${TIMEFORM_CARD_CONTENT}`);
  }

  /**
   * Gets the verdict label of the card
   * @return {HTMLElement} the verdict label
   */
  get verdictLabel() {
    return this.element.$(`~${TIMEFORM_CARD_VERDICT_LABEL}`);
  }

  /**
   * Gets the verdict text of the card
   * @return {HTMLElement} the verdict text
   */
  get verdictText() {
    return this.element.$(`~${TIMEFORM_CARD_VERDICT_TEXT}`);
  }

  /**
   * Gets the runners of the card
   * @return {HTMLElement} The runners
   */
  get runners() {
    return this.element.$$(`~${TIMEFORM_CARD_RUNNER_RATING}`);
  }

  /**
   * Gets the runners rating text of the card
   * @return {HTMLElement} The runners
   */
  get runnersRating() {
    return this.element.$$(`~${TIMEFORM_CARD_RUNNER_RATING_TEXT}`);
  }
};
