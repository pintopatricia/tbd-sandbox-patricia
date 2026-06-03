const {
  TEST_ID,
  CAPTION,
  CAPTION_LABEL,
} = require("@ppb/the-wall-web/components/bricks/RecentFormCaption/RecentFormCaption.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentFormCaptionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the caption component
   * @return {HTMLElement} Caption component
   */
  get caption() {
    return this.element.$(CAPTION);
  }

  /**
   * Gets the items inside caption component
   * @return {HTMLElement} list of caption labels
   */
  get captionLabels() {
    return this.element.$$(CAPTION_LABEL);
  }
};
