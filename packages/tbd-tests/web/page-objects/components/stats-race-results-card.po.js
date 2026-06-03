const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const {
  TEST_ID: TEST_ID_HORSE_RACING_RUNNER,
} = require("@ppb/the-wall-web/components/walls/HorseRacingRunner/HorseRacingRunner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class StatsRaceResultsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get horseRacingRunnerList() {
    return this.element.$$(TEST_ID_HORSE_RACING_RUNNER);
  }
};
