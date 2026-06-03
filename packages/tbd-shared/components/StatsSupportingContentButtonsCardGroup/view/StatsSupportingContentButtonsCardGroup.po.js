const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  BUTTONS,
} = require("../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.web.selectors");

class StatsSupportingContentButtonsCardGroupPO extends BasePO {
  /**
   * Creates a stats pebble card group page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get buttons() {
    return this.element.$$(BUTTONS);
  }
}

module.exports = StatsSupportingContentButtonsCardGroupPO;
