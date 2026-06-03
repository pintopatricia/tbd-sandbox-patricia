const {
  SPORTSBOOK_MARKET,
  SPORTSBOOK_MARKET_BLURBS,
} = require("@ppb/the-wall-native/components/SportsbookMarket/SportsbookMarket.selectors");
const { RUNNER } = require("@ppb/the-wall-native/components/Runner/Runner.selectors");
const {
  HORSE_RUNNER,
} = require("@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner.selectors");
const {
  TEST_ID: VIRTUAL_RUNNER,
} = require("@ppb/tbd-shared/components/VirtualMarketCard/snowflakes/VirtualRunner/VirtualRunner.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SportsbookMarketSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SPORTSBOOK_MARKET}`));
  }

  get blurbs() {
    return this.element.$(`~${SPORTSBOOK_MARKET_BLURBS}`);
  }

  get runnerList() {
    return this.element.$$(`~${RUNNER}`);
  }

  get horseRunnerList() {
    return this.element.$$(`~${HORSE_RUNNER}`);
  }

  get virtualRunnerList() {
    return this.element.$$(`~${VIRTUAL_RUNNER}`);
  }
}

module.exports = SportsbookMarketSO;
