const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  RESULTS_TO_FOLLOW_LABEL,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL,
  WINNING_TIME_LABEL,
  WINNING_TIME,
  BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE,
} = require("./RaceResultsCard.web.selectors");

module.exports = class RaceResultsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get resultsToFollowLabel() {
    return this.element.$(RESULTS_TO_FOLLOW_LABEL);
  }

  get winningTimeAndBspAdvantageLabel() {
    return this.element.$(WINNING_TIME_AND_BSP_ADVANTAGE_LABEL);
  }

  get winningTimeLabel() {
    return this.element.$(WINNING_TIME_LABEL);
  }

  get bspAdvantageLabel() {
    return this.element.$(BSP_ADVANTAGE_LABEL);
  }

  get winningTime() {
    return this.element.$(WINNING_TIME);
  }

  get bspAdvantage() {
    return this.element.$(BSP_ADVANTAGE);
  }
};
