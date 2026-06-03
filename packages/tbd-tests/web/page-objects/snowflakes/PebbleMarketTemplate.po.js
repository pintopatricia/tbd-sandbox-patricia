const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/PebbleCardGroup/snowflakes/PebbleMarketTemplate/PebbleMarketTemplate.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PebbleMarketTemplatePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = PebbleMarketTemplatePO;
