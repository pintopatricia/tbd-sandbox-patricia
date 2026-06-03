const {
  RACING_RESULTS,
  RACING_RESULTS_TITLE,
  RACING_RESULTS_TABLE_HEADERS,
  RACING_RESULTS_TABLE_ROW,
  RACING_RESULTS_POSITION,
  RACING_RESULTS_DISTANCE,
  RACING_RESULTS_HORSE_NAME,
  RACING_RESULTS_STARTING_PRICE,
  RACING_RESULTS_NUMBER_OF_RAN_RUNNERS,
  RACING_RESULTS_RUNNER,
  RACING_RESULTS_RUNNER_SILK,
  RACING_RESULTS_RUNNER_SILK_DEFAULT,
  RACING_RESULTS_DRAW_NUMBER,
  RACING_RESULTS_JOCKEY_NAME,
  RACING_RESULTS_TRAINER_NAME,
  RACING_RESULTS_SADDLE_CLOTH,
  RACING_RESULTS_WINNER_RIBBON,
  RACING_RESULTS_DNFS_BOARD,
  RACING_RESULTS_DNFS_INFO,
  RACING_RESULTS_DNF_ITEM,
  RACING_RESULTS_DNF_CODE,
  RACING_RESULTS_DNF_VALUE,
  RACING_RESULTS_FAV,
} = require("@ppb/tbd-shared/components/RaceResultsCard/snowflakes/RacingResults/RacingResults.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RacingResultsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACING_RESULTS}`));
  }

  get title() {
    return this.element.$(`~${RACING_RESULTS_TITLE}`);
  }

  get headers() {
    return this.element.$$(`~${RACING_RESULTS_TABLE_HEADERS}`);
  }

  get tableRow() {
    return this.element.$$(`~${RACING_RESULTS_TABLE_ROW}`);
  }

  get positions() {
    return this.element.$$(`~${RACING_RESULTS_POSITION}`);
  }

  get distances() {
    return this.element.$$(`~${RACING_RESULTS_DISTANCE}`);
  }

  get horseNames() {
    return this.element.$$(`~${RACING_RESULTS_HORSE_NAME}`);
  }

  get startingPrices() {
    return this.element.$$(`~${RACING_RESULTS_STARTING_PRICE}`);
  }

  get numberOfRanRunners() {
    return this.element.$(`~${RACING_RESULTS_NUMBER_OF_RAN_RUNNERS}`);
  }

  get runners() {
    return this.element.$$(`~${RACING_RESULTS_RUNNER}`);
  }

  get silks() {
    return this.element.$$(`~${RACING_RESULTS_RUNNER_SILK}`);
  }

  get defaultSilks() {
    return this.element.$$(`~${RACING_RESULTS_RUNNER_SILK_DEFAULT}`);
  }

  get jockeyNames() {
    return this.element.$$(`~${RACING_RESULTS_JOCKEY_NAME}`);
  }

  get trainerName() {
    return this.element.$$(`~${RACING_RESULTS_TRAINER_NAME}`);
  }

  get drawNumbers() {
    return this.element.$$(`~${RACING_RESULTS_DRAW_NUMBER}`);
  }

  get saddleCloths() {
    return this.element.$$(`~${RACING_RESULTS_SADDLE_CLOTH}`);
  }

  get winnerRibbon() {
    return this.element.$(`~${RACING_RESULTS_WINNER_RIBBON}`);
  }

  get dnfsBoard() {
    return this.element.$(`~${RACING_RESULTS_DNFS_BOARD}`);
  }

  get dnfsInfo() {
    return this.element.$(`~${RACING_RESULTS_DNFS_INFO}`);
  }

  get dnfItems() {
    return this.element.$$(`~${RACING_RESULTS_DNF_ITEM}`);
  }

  get dnfCodes() {
    return this.element.$$(`~${RACING_RESULTS_DNF_CODE}`);
  }

  get dnfValues() {
    return this.element.$$(`~${RACING_RESULTS_DNF_VALUE}`);
  }

  get favouriteLabels() {
    return this.element.$$(`~${RACING_RESULTS_FAV}`);
  }
}

module.exports = RacingResultsSO;
