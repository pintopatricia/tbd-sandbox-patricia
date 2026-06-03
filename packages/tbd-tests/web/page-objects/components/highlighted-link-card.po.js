const {
  TEST_ID,
  LABEL,
  ARROW,
  CARD_ICON,
  NEW_GAMES_INDICATOR,
} = require("@ppb/the-wall-web/components/bricks/HighlightedLinkCard/HighlightedLinkCard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HighlightedLinkCardPO extends BasePO {
  /**
   * Creates a secondary event card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the label of the card
   * @return {HTMLElement} The label
   */
  get label() {
    return this.element.$(LABEL);
  }

  /**
   * Gets the arrow icon of the card
   * @return {HTMLElement} The arrow
   */
  get arrow() {
    return this.element.$(ARROW);
  }

  get icon() {
    return this.element.$(CARD_ICON);
  }

  get indicator() {
    return this.element.$(NEW_GAMES_INDICATOR);
  }
};
