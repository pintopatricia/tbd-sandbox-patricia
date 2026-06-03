const { TEST_ID, TITLE, ICON, ARROW } = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class QuickLinkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the quick link title element
   * Uses the `TITLE` selector
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Return the icon element
   * Uses the `ICON` selector
   */
  get icon() {
    return this.element.$(ICON);
  }

  /**
   * Returns the arrow element
   * Uses the `ARROW` selector
   */
  get arrow() {
    return this.element.$(ARROW);
  }

  get myBets() {
    return $("//a[@href='mybets/open/mb-6f70656e' and .//div[text()='My Bets']]");
  }
}

module.exports = QuickLinkPO;
