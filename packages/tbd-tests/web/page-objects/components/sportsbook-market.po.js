const {
  MARKET_HEADER,
  TEST_ID,
  AZ_SWITCHER,
} = require("@ppb/the-wall-web/components/walls/SportsbookMarket/SportsbookMarket.selectors");
const { TEST_ID: RUNNER } = require("@ppb/the-wall-web/components/walls/Runner/Runner.selectors");
const {
  TEST_ID: VIRTUAL_RUNNER,
} = require("@ppb/tbd-shared/components/VirtualMarketCard/snowflakes/VirtualRunner/VirtualRunner.web.selectors");
const {
  TEST_ID: TEST_ID_HORSE_RACING_RUNNER,
} = require("@ppb/the-wall-web/components/walls/HorseRacingRunner/HorseRacingRunner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SportsbookMarketPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get marketTitle() {
    return this.element.$(MARKET_HEADER);
  }

  get runnerList() {
    return this.element.$$(RUNNER);
  }

  get horseRacingRunnerList() {
    return this.element.$$(TEST_ID_HORSE_RACING_RUNNER);
  }

  get virtualRunnerList() {
    return this.element.$$(VIRTUAL_RUNNER);
  }

  get azSwitcher() {
    return this.element.$(AZ_SWITCHER);
  }
}

module.exports = SportsbookMarketPO;
