const { TITLE, MESSAGE } = require("@ppb/the-wall-web/components/bricks/EmptyState/EmptyState.selectors");
const { TEST_ID } = require("./FavouriteMarketsEmptyState.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class FavouriteMarketsEmptyStatePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the title of the view
   * @return {HTMLElement} The title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the message of the view
   * @return {HTMLElement} The message
   */
  get message() {
    return this.element.$(MESSAGE);
  }
};
