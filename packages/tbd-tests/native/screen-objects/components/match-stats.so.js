const {
  MATCH_STATS_CONTAINER,
  MATCH_STATS_BAR_CONTAINER,
  MATCH_STATS_CARD_CONTAINER,
  MATCH_STATS_STATS_CONTAINER,
  MATCH_STATS_BAR_WRAPPER,
  MATCH_STATS_CARD_WRAPPER,
} = require("@ppb/the-wall-native/components/MatchStats/MatchStats.selectors");

const { PROGRESS_BAR } = require("@ppb/the-wall-native/components/ProgressBar/ProgressBar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MatchStatsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MATCH_STATS_CONTAINER}`));
  }

  get barStatContainer() {
    return this.element.$(`~${MATCH_STATS_BAR_CONTAINER}`);
  }

  get cardStatContainer() {
    return this.element.$(`~${MATCH_STATS_CARD_CONTAINER}`);
  }

  get statsContainer() {
    return this.element.$(`~${MATCH_STATS_STATS_CONTAINER}`);
  }

  get barsWrapper() {
    return this.element.$$(`~${MATCH_STATS_BAR_WRAPPER}`);
  }

  get cardsWrapper() {
    return this.element.$$(`~${MATCH_STATS_CARD_WRAPPER}`);
  }

  get progressBars() {
    return this.element.$$(`~${PROGRESS_BAR}`);
  }
}

module.exports = MatchStatsSO;
