const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/ImsPromotionStateCard/snowflakes/OngoingBadge/OngoingBadge.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OngoingBadgePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = OngoingBadgePO;
