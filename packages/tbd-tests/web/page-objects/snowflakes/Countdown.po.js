const { TEST_ID } = require("@ppb/tbd-shared/components/ExtraWalletCard/snowflakes/Countdown/Countdown.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CountdownPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = CountdownPO;
