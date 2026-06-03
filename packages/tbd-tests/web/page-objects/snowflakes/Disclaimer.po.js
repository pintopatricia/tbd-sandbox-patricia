const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/ImsPromotionStateCard/snowflakes/ClaimNowPromo/snowflakes/Disclaimer/Disclaimer.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class DisclaimerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = DisclaimerPO;
