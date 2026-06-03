const {
  ODDS,
  ODDS_VALUE,
  ODDS_PREVIOUS_VALUE,
  ODDS_ICON,
} = require("@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class OddsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ODDS}`));
  }

  get odds() {
    return this.element.$(`~${ODDS_VALUE}`);
  }

  get previousOdds() {
    return this.element.$(`~${ODDS_PREVIOUS_VALUE}`);
  }

  get icon() {
    return this.element.$(`~${ODDS_ICON}`);
  }
}

module.exports = OddsSO;
