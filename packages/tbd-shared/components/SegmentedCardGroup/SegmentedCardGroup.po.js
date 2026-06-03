const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID,
  SWIMLANE,
  GAMING_ZONE,
  SEGMENTED_TITLE,
  SEGMENTED_GAME_TILE,
  SEGMENTED_GAME_WRAPPER,
} = require("./SegmentedCardGroup.selectors");

module.exports = class SegmentedCardGroupPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets the scrollable swimlane from SegmentedCardGroup
   * @return {HTMLElement} The scrollable swimlane
   */
  get getScrollableSwimlane() {
    return this.element.$(SWIMLANE);
  }

  /**
   * Gets the gaming zones from swimlane
   * @return {HTMLElement} The gaming zones
   */
  get gamingZones() {
    return this.element.$$(GAMING_ZONE);
  }

  /**
   * Gets the title from swimlane
   * @return {HTMLElement} The gaming zones
   */
  get segmentedTitle() {
    return this.element.$$(SEGMENTED_TITLE);
  }

  /**
   * Gets the game tile from swimlane
   * @return {HTMLElement} The gaming zones
   */
  get segmentedGameTile() {
    return this.segmentedGameWrapper.$$(SEGMENTED_GAME_TILE);
  }

  /**
   * Gets the game wrapper from swimlane
   * @return {HTMLElement} The gaming zones
   */
  get segmentedGameWrapper() {
    return this.element.$(SEGMENTED_GAME_WRAPPER);
  }
};
