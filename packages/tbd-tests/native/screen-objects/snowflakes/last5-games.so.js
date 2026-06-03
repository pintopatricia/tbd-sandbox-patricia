const {
  LAST_5_GAMES,
} = require("@ppb/tbd-components-rich-data/components/StatsFormCard/view/snowflakes/Last5Games/Last5Games.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class Last5GamesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${LAST_5_GAMES}`));
  }
}

module.exports = Last5GamesSO;
