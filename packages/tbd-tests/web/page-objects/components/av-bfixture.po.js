const { TEST_ID, TITLE } = require("@ppb/the-wall-web/components/bricks/AvBFixture/AvBFixture.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class AvBFixturePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the fixture competition title
   * @return {HTMLElement} The fixture title
   */
  get avbFixtureTitle() {
    return this.element.$(TITLE);
  }
};
