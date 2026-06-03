const {
  TEST_ID,
  BOX,
  ICON_WRAPPER,
  TITLE_WRAPPER,
  TITLE,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/RewardCard/RewardCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RewardCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the container for the reward card
   * Uses the `BOX` selector
   */
  get box() {
    return this.element.$(BOX);
  }

  /**
   * Returns the wrapper for the icon
   * Uses the `ICON_WRAPPER` selector
   */
  get iconWrapper() {
    return this.element.$(ICON_WRAPPER);
  }

  /**
   * Returns the wrapper for the title
   * Uses the `TITLE_WRAPPER` selector
   */
  get titleWrapper() {
    return this.element.$(TITLE_WRAPPER);
  }

  /**
   * Returns the title for each plan
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }
};
