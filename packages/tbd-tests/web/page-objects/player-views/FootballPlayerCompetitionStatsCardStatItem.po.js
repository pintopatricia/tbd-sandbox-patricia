const SELECTORS = require("@ppb/tbd-shared/components/PlayerView/components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class FootballPlayerCompetitionStatsCardStatItemPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_ITEM));
  }

  get label() {
    return this.element.$(SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_LABEL);
  }

  get value() {
    return this.element.$(SELECTORS.FOOTBALL_PLAYER_COMPETITION_STAT_CARD_STAT_VALUE);
  }
};
