const { STATS_PLAYERS_CONTAINER, SCROLL_ITEM, INFO_LABEL } = require("./StatsPlayersInPlayCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TeamSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STATS_PLAYERS_CONTAINER}`));
  }

  get scrollItems() {
    return this.element.$$(`~${SCROLL_ITEM}`);
  }

  get infoLabel() {
    return this.element.$(`~${INFO_LABEL}`);
  }
}

module.exports = TeamSO;
