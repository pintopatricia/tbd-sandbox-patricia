const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, SUBTITLE, QUICK_LINK_CONTAINER, QUICK_LINK } = require("./DefaultGamingBrowse.web.selectors");

module.exports = class GamesCardGroupPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets subtitle from gaming browse view
   * @return {HTMLElement} The gaming browse view subtitle
   */
  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  /**
   * Gets quick link containers from gaming browse view
   * @return {HTMLElement} The quick link containers
   */
  get quickLinksContainer() {
    return this.element.$(QUICK_LINK_CONTAINER);
  }

  /**
   * Gets quick link list from gaming browse view
   * @return {HTMLElement} The quick link list
   */
  get quickLinksList() {
    return this.element.$$(QUICK_LINK);
  }
};
