const SELECTORS = require("@ppb/tbd-shared/components/PlayerView/components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballPlayerCompetitionStatsCardPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STATS_CARD_CONTAINER}`));
  }

  get stats() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STATS}`);
  }
  get statItems() {
    return this.element.$$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM}`);
  }

  get title() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STATS_CARD_TITLE}`);
  }

  get loadingLabel() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STATS_CARD_LOADING_LABEL}`);
  }

  get noStatsLabel() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STATS_CARD_NO_STATS_LABEL}`);
  }

  get headerTitle() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STATS_CARD_HEADER_TITLE}`);
  }
};
