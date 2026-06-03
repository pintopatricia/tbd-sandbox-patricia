const SELECTORS = require("@ppb/tbd-shared/components/PlayerView/components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballPlayerCompetitionStatsCardStatItemPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM}`));
  }

  get label() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL}`);
  }

  get value() {
    return this.element.$(`~${SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE}`);
  }
};
