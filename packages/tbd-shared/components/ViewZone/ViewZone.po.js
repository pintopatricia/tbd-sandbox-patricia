const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID: TEST_ID_CARD_GROUP } = require("../GamesCardGroup/GamesCardGroup.web.selectors");
const { TEST_ID: TEST_ID_SEGMENTED_CARD_GROUP } = require("../SegmentedCardGroup/SegmentedCardGroup.selectors");

const { TEST_ID, TITLE } = require("./ViewZone.web.selectors");

module.exports = class ViewZonePO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets the view zone title
   * @return {HTMLElement} The view zone title
   */
  get getTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the card group container from view zone
   * @return {HTMLElement} The card group container
   */
  get cardGroup() {
    return this.element.$(TEST_ID_CARD_GROUP);
  }

  /**
   * Gets the segmented card group container from view zone
   * @return {HTMLElement} The segmented card group container
   */
  get segmentedCardGroup() {
    return this.element.$(TEST_ID_SEGMENTED_CARD_GROUP);
  }
};
