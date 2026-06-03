const {
  TEST_ID,
  ICON,
  TITLE,
  SCROLL_SECTION,
  SCROLL_ITEMS,
  SCROLL_ITEMS_PLACEHOLDER,
  HEADER,
  NAV_LINK,
  ARROW_LEFT,
  ARROW_RIGHT,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  TEST_ID: HIGHLIGHTED_LINK_CARD,
} = require("@ppb/the-wall-web/components/bricks/HighlightedLinkCard/HighlightedLinkCard.selectors");
const {
  TEST_ID: SECONDARY_EVENT_CARD,
} = require("@ppb/tbd-shared/components/EventViewLinkCard/snowflakes/SecondaryEventCard/SecondaryEventCard.web.selectors");
const {
  TEST_ID: HIGHLIGHTED_SELECTION_CARD,
} = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.web.selectors");
const {
  TEST_ID: TEST_ID_GAMETILE,
} = require("@ppb/tbd-shared/components/GameCard/snowflakes/GameTile/GameTile.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ScrollableSwimlanePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the scrollable swimlane header
   * @return {HTMLElement} The scrollable swimlane header
   */
  get header() {
    return this.element.$(HEADER);
  }

  /**
   * Gets the scrollable swimlane icon
   * @return {HTMLElement} The scrollable swimlane icon
   */
  get icon() {
    return this.element.$(ICON);
  }

  /**
   * Gets the scrollable swimlane title
   * @return {HTMLElement} The scrollable swimlane title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the scrollable swimlane nav link
   * @return {HTMLElement} The scrollable nav link
   */
  get navLink() {
    return this.element.$(NAV_LINK);
  }

  /**
   * Gets the scroll section
   * @return {HTMLElement} The scroll section
   */
  get scrollSection() {
    return this.element.$(SCROLL_SECTION);
  }

  get scrollItems() {
    return this.element.$$(SCROLL_ITEMS);
  }

  get scrollItemsPlaceholders() {
    return this.element.$$(SCROLL_ITEMS_PLACEHOLDER);
  }

  /**
   * Gets the game tile list
   * @return {HTMLElement} a list of game tiles
   */
  get gameTiles() {
    return this.scrollSection.$$(TEST_ID_GAMETILE);
  }

  /**
   * Gets the highlighted link card list
   * @return {HTMLElement} a list of highlighted link cards
   */
  get highlightedLinkCards() {
    return this.element.$$(HIGHLIGHTED_LINK_CARD);
  }

  /**
   * Gets the highlighted selection card list
   * @return {HTMLElement[]} a list of highlighted selection cards
   */
  get highlightedSelectionCards() {
    return this.element.$$(HIGHLIGHTED_SELECTION_CARD);
  }

  /**
   * Gets the secondary event card list
   * @return {HTMLElement[]} a list of secondary event cards
   */
  get secondaryEventCards() {
    return this.element.$$(SECONDARY_EVENT_CARD);
  }

  get arrowLeft() {
    return this.element.$(ARROW_LEFT);
  }

  get arrowRight() {
    return this.element.$(ARROW_RIGHT);
  }
};
