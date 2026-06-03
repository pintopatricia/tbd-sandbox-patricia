const {
  TEST_ID,
  TITLE,
  SUBTITLE,
  REFUSE_BUTTON,
  ACCEPT_BUTTON,
} = require("@ppb/the-wall-web/components/rooms/ConfirmDrawer/ConfirmDrawer.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ConfirmDrawerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the webElement of the root element for filter drawer
   * Uses the `TEST_ID` selector
   */
  get root() {
    return this.element.$(TEST_ID);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get refuseButton() {
    return this.element.$(REFUSE_BUTTON);
  }

  get acceptButton() {
    return this.element.$(ACCEPT_BUTTON);
  }
}

module.exports = ConfirmDrawerPO;
