const {
  TEST_ID,
  SUBTITLE,
  TITLE,
  INPLAY,
} = require("@ppb/the-wall-web/components/walls/EventHeader/EventHeader.selectors");
const { TEST_ID: AVB_FIXTURE_ID } = require("@ppb/the-wall-web/components/bricks/AvBFixture/AvBFixture.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class EventHeaderPO extends BasePO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get inplay() {
    return this.element.$(INPLAY);
  }

  get avbFixture() {
    return this.element.$(AVB_FIXTURE_ID);
  }
}

module.exports = EventHeaderPO;
