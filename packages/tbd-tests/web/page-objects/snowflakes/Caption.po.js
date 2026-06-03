const {
  CAPTION,
  CAPTION_ITEM,
} = require("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/snowflakes/Caption/Caption.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CaptionPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${CAPTION}"]`));
  }

  /**
   * Gets a list with all the content in the caption container
   * @return {HTMLElement} Caption Content Elements List
   */
  get captionContent() {
    return this.element.$$(`[data-testid="${CAPTION_ITEM}"]`);
  }
};
