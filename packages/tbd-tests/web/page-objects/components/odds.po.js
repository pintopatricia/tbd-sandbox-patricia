const {
  TEST_ID,
  ODDS_VALUE,
  ODDS_PREVIOUS_VALUE,
  ODDS_ICON,
} = require("@ppb/the-wall-web/components/bricks/Indicators/Odds/Odds.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class OddsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get icon() {
    return this.element.$(ODDS_ICON);
  }

  get value() {
    return this.element.$(ODDS_VALUE);
  }

  get previousValue() {
    return this.element.$(ODDS_PREVIOUS_VALUE);
  }
}

module.exports = OddsPO;
