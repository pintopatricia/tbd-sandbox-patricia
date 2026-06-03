const { BaseSO } = require("@ppb/wdio-lazy-element");

const { EVENT_STATS_CARD } = require("./EventStatsCard.native.selectors");

class EventStatsCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EVENT_STATS_CARD}`));
  }
}

module.exports = EventStatsCardSO;
