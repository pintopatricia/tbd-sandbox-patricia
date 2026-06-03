const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");

const {
  BET_SELECTION_DETAILS,
  BET_SELECTION_DETAILS_CONTAINER,
  BET_SELECTION_DETAILS_ODD_CONTAINER,
  BET_SELECTION_DETAILS_TITLE,
  BET_SELECTION_DETAILS_SUBTITLE,
  BET_SELECTION_DETAILS_ODD_VALUE,
  BET_SELECTION_DETAILS_EVENT_LINK,
} = require("@ppb/the-wall-native/components/BetDetails/BetSelectionDetails/BetSelectionDetails.selectors");

const {
  COUNTER_AGGREGATOR_TITLE,
  COUNTER_AGGREGATOR,
} = require("@ppb/tbd-shared/components/MarketBetCard/snowflakes/CounterAggregator/CounterAggregator.native.selectors");

const {
  FOOTBALL_SCOREBOARD,
} = require("@ppb/the-wall-native/components/Scoreboard/FootballScoreboard/FootballScoreboard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SbkExpandableLegSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD}`));
  }

  get counter() {
    return this.element.$(`~${COUNTER_AGGREGATOR}`);
  }

  get counterLabel() {
    return this.element.$(`~${COUNTER_AGGREGATOR_TITLE}`);
  }

  get sbkMultipleSelection() {
    return this.element.$$(`~${BET_SELECTION_DETAILS}`);
  }

  get sbkMultipleSelectionContainer() {
    return this.element.$(`~${BET_SELECTION_DETAILS_CONTAINER}`);
  }

  get sbkMultipleSelectionOddContainer() {
    return this.element.$(`~${BET_SELECTION_DETAILS_ODD_CONTAINER}`);
  }

  get sbkMultipleSelectionTitle() {
    return this.element.$$(`~${BET_SELECTION_DETAILS_TITLE}`);
  }

  get sbkMultipleSelectionSubtitle() {
    return this.element.$$(`~${BET_SELECTION_DETAILS_SUBTITLE}`);
  }

  get sbkMultipleSelectionOddValue() {
    return this.element.$$(`~${BET_SELECTION_DETAILS_ODD_VALUE}`);
  }

  get sbkBetPanelMultiplesEventLink() {
    return this.element.$$(`~${BET_SELECTION_DETAILS_EVENT_LINK}`);
  }

  get footballScoreboards() {
    return this.element.$$(`~${FOOTBALL_SCOREBOARD}`);
  }
}

module.exports = SbkExpandableLegSO;
