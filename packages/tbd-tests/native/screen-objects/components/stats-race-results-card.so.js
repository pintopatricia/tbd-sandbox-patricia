const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const {
  HORSE_RUNNER,
} = require("@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class StatsRaceResultsCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD}`));
  }

  get horseRacingRunnerList() {
    return this.element.$$(`~${HORSE_RUNNER}`);
  }
};
