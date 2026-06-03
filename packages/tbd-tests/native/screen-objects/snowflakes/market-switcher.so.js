const {
  MARKET_SWITCHER,
  MARKET_SWITCHER_BUTTON,
  MARKET_SWITCHER_ICON,
  MARKET_SWITCHER_LABEL,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MatchTimelineDetails/MatchTimelineDetails.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketSwitcherSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_SWITCHER}`));
  }

  get button() {
    return this.element.$(`~${MARKET_SWITCHER_BUTTON}`);
  }

  get label() {
    return this.element.$(`~${MARKET_SWITCHER_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${MARKET_SWITCHER_ICON}`);
  }
}

module.exports = MarketSwitcherSO;
