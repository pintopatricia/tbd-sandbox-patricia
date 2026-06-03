const { BasePO } = require("@ppb/wdio-lazy-element");
const { IFRAME, HEADER } = require("./MarketGraph.web.selectors");

module.exports = class MarketGraphPO extends BasePO {
  /**
   * Creates a market graph page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    if (!lazyElement) {
      throw Error("MarketGraphPO selector is mandatory");
    }

    super(lazyElement);
  }

  /**
   * Gets the header (with event and market names) section
   * @return {HTMLElement} RichText component with event and market names
   */
  get header() {
    return this.element.$(HEADER);
  }

  /**
   * Gets the EGA iframe
   * @return {HTMLElement} The EGA iframe
   */
  get iframe() {
    return this.element.$(IFRAME);
  }
};
