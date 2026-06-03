const {
  TEST_ID,
  TEXT,
  BUTTON,
} = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web.selectors");
const {
  TEST_ID: SBK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const styles = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HighlightedSelectionCardPO extends BasePO {
  /**
   * Creates a secondary event card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      closed: styles.closed.replace(".", ""),
    };
  }

  /**
   * Gets the text of the card
   * @return {HTMLElement} The text
   */
  get text() {
    return this.element.$(TEXT);
  }

  get button() {
    return this.element.$(BUTTON);
  }

  get sportsbookBetButton() {
    return this.element.$(SBK_BET_BUTTON);
  }
};
