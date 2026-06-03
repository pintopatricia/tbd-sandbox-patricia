const {
  TEST_ID,
  FAVOURITES_WELCOME,
  FAVOURITES_TITLE,
  FAVOURITES_EMPTY_MESSAGE,
  FAVOURITES_EMPTY_INSTRUCTION,
  FAVOURITES_HEART_ICON,
  WIDGET_POSITION,
} = require("@ppb/tbd-shared/components/GamingCardGroup/GamingCardGroup.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GamingCardGroupPO extends BasePO {
  /**
   * Creates a Game Tile page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the favourites welcome element
   * @return {HTMLElement} The favourites welcome element
   */
  get favouritesWelcome() {
    return this.element.$(FAVOURITES_WELCOME);
  }

  /**
   * Gets the favourites title element
   * @return {HTMLElement} The favourites title element
   */
  get favouritesTitle() {
    return this.element.$(FAVOURITES_TITLE);
  }

  /**
   * Gets the favourites empty message
   * @return {HTMLElement} The favourites empty message
   */
  get favouritesEmptyMessage() {
    return this.element.$(FAVOURITES_EMPTY_MESSAGE);
  }

  /**
   * Gets the favourites empty instruction
   * @return {HTMLElement} The favourites empty instruction
   */
  get favouritesEmptyInstruction() {
    return this.element.$(FAVOURITES_EMPTY_INSTRUCTION);
  }

  /**
   * Gets the favourites heart icon
   * @return {HTMLElement} The favourites heart icon
   */
  get favouritesHeartIcon() {
    return this.element.$(FAVOURITES_HEART_ICON);
  }

  get gameTileWidgetPositioning() {
    return this.element.$(WIDGET_POSITION);
  }
};
