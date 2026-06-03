const {
  MINIMIZED_TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/Minimized/Minimized.native.selectors");
const {
  MINIMIZED_STRONG_TITLE,
  MINIMIZED_WEAK_TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/RootBetslip.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetslipMinimizedSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MINIMIZED_TITLE}`));
  }

  get strongTitle() {
    return this.element.$(`~${MINIMIZED_STRONG_TITLE}`);
  }

  get weakTitle() {
    return this.element.$(`~${MINIMIZED_WEAK_TITLE}`);
  }
}

module.exports = BetslipMinimizedSO;
