const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  RACE_RESULTS_CARD,
  RESULTS_TO_FOLLOW_LABEL,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL,
  WINNING_TIME_LABEL,
  WINNING_TIME,
  BSP_ADVANTAGE_LABEL,
  BSP_ADVANTAGE,
} = require("./RaceResultsCard.native.selectors");
/**
 * Class that represents the Race Results Card SO
 *
 */
class RaceResultsCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACE_RESULTS_CARD}`));
  }

  get resultsToFollowLabel() {
    return this.element.$(`~${RESULTS_TO_FOLLOW_LABEL}`);
  }

  get winningTimeAndBspAdvantageLabel() {
    return this.element.$(`~${WINNING_TIME_AND_BSP_ADVANTAGE_LABEL}`);
  }

  get winningTimeLabel() {
    return this.element.$(`~${WINNING_TIME_LABEL}`);
  }

  get bspAdvantageLabel() {
    return this.element.$(`~${BSP_ADVANTAGE_LABEL}`);
  }

  get winningTime() {
    return this.element.$(`~${WINNING_TIME}`);
  }

  get bspAdvantage() {
    return this.element.$(`~${BSP_ADVANTAGE}`);
  }
}

module.exports = RaceResultsCardSO;
