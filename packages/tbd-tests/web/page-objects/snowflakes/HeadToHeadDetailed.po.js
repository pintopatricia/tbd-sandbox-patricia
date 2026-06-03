const { TEST_ID: RESULTS } = require("@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult.selectors");
const {
  CAPTION_CONTENT,
  TEST_ID,
} = require("@ppb/tbd-shared/components/HeadToHeadCard/snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class HeadToHeadDetailedPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets all head2head results
   * @return {HTMLElement} HeadToHead results
   */
  get results() {
    return this.element.$$(RESULTS);
  }

  /**
   * Gets a list with all the content in the caption container
   * @return {HTMLElement} Caption Content Elements List
   */
  get captionContent() {
    return this.element.$$(CAPTION_CONTENT);
  }
};
