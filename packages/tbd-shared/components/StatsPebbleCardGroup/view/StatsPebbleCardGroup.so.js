const { BaseSO } = require("@ppb/wdio-lazy-element");
const { STATS_PEBBLE_CARD_GROUP_CONTAINER } = require("./StatsPebbleCardGroup.native.selectors");

class StatsPebbleCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STATS_PEBBLE_CARD_GROUP_CONTAINER}`));
  }
}

module.exports = StatsPebbleCardGroupSO;
