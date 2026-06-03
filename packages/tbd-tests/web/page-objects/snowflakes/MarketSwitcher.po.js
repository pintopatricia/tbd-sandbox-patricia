const {
  TEST_ID,
  TITLE,
  LABEL,
  BUTTON,
  CHEVRON,
} = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/snowflakes/MarketSwitcher/MarketSwitcher.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketSwitcherPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get button() {
    return this.element.$(BUTTON);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get label() {
    return this.element.$(LABEL);
  }

  get chevron() {
    return this.element.$(CHEVRON);
  }
}

module.exports = MarketSwitcherPO;
