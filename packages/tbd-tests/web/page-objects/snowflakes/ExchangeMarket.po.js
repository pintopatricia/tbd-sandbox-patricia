const {
  TEST_ID,
  CASHOUT_CONTAINER,
} = require("@ppb/tbd-shared/components/ExchangeMarket/ExchangeMarket.web.selectors");
const { TEST_ID: TEST_ID_RUNNER } = require("@ppb/the-wall-web/components/walls/Runner/Runner.selectors");
const {
  TEST_ID: TEST_ID_HORSE_RACING_RUNNER,
} = require("@ppb/the-wall-web/components/walls/HorseRacingRunner/HorseRacingRunner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ExchangeMarketPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runnerList() {
    return this.element.$$(TEST_ID_RUNNER);
  }

  get horseRacingRunnerList() {
    return this.element.$$(TEST_ID_HORSE_RACING_RUNNER);
  }

  get cashoutContainer() {
    return this.element.$(CASHOUT_CONTAINER);
  }
}

module.exports = ExchangeMarketPO;
