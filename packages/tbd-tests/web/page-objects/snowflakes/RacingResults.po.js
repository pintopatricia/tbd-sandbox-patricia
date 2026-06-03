const {
  TEST_ID,
  TITLE,
  TABLE,
  TABLE_HEADER,
  POSITION,
  DISTANCE,
  RUNNER,
  STARTING_PRICE,
  NUMBER_OF_RAN_RUNNERS,
  HORSE_NAME,
  JOCKEY_NAME,
  TRAINER_NAME,
  DRAW,
  SADDLE_CLOTH,
  SILK,
  DEFAULT_SILK,
  WINNER_RIBBON,
  DNFS_BOARD,
  DNF_ITEM,
  FAVOURITE_LABEL,
} = require("@ppb/tbd-shared/components/RaceResultsCard/snowflakes/RacingResults/RacingResults.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentRacesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get table() {
    return this.element.$(TABLE);
  }

  get tableHeaders() {
    return this.element.$$(TABLE_HEADER);
  }

  get positions() {
    return this.element.$$(POSITION);
  }

  get distances() {
    return this.element.$$(DISTANCE);
  }

  get runners() {
    return this.element.$$(RUNNER);
  }

  get startingPrices() {
    return this.element.$$(STARTING_PRICE);
  }

  get numberOfRanRunners() {
    return this.element.$(NUMBER_OF_RAN_RUNNERS);
  }

  get horseNames() {
    return this.element.$$(HORSE_NAME);
  }

  get jockeyNames() {
    return this.element.$$(JOCKEY_NAME);
  }

  get trainerName() {
    return this.element.$$(TRAINER_NAME);
  }

  get silks() {
    return this.element.$$(SILK);
  }

  get defaultSilks() {
    return this.element.$$(DEFAULT_SILK);
  }

  get drawNumbers() {
    return this.element.$$(DRAW);
  }

  get saddleCloths() {
    return this.element.$$(SADDLE_CLOTH);
  }

  get winnerRibbon() {
    return this.element.$(WINNER_RIBBON);
  }

  get dnfsBoard() {
    return this.element.$(DNFS_BOARD);
  }

  get dnfItems() {
    return this.element.$$(DNF_ITEM);
  }

  get favouriteLabels() {
    return this.element.$$(FAVOURITE_LABEL);
  }
};
