const {
  TEST_ID,
  TEXT,
  TITLE,
  SUBTITLE,
} = require("@ppb/tbd-shared/components/MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web.selectors");
const {
  TEST_ID: SBK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const styles = require("@ppb/tbd-shared/components/MatchStatSelectionCard/snowflakes/MatchStatSelection/MatchStatSelection.web.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MatchStatSelectionCardPO extends BasePO {
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
   * Gets the title of the card
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the subtitle of the card
   * @return {HTMLElement} The subtitle
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  /**
   * Gets the text of the card
   * @return {HTMLElement} The text
   */
  get text() {
    return this.element.$(TEXT);
  }

  get sportsbookBetButton() {
    return this.element.$(SBK_BET_BUTTON);
  }
};
