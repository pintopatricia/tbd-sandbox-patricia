const { TEST_ID, TITLE_TEXT } = require("@ppb/the-wall-web/components/rooms/MessageBanner/MessageBanner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MessageBannerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE_TEXT);
  }
}

module.exports = MessageBannerPO;
