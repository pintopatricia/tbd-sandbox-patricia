const { EXPANDABLE } = require("@ppb/the-wall-native/components/Betslip/Expandable/Expandable.selectors");
const {
  MINIMIZED_STRONG_TITLE,
  MINIMIZED_WEAK_TITLE,
  MINIMIZED_ERROR_TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/RootBetslip.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RootBetslipSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXPANDABLE}`));
  }

  get strongTitle() {
    return this.element.$(`~${MINIMIZED_STRONG_TITLE}`);
  }

  get weakTitle() {
    return this.element.$(`~${MINIMIZED_WEAK_TITLE}`);
  }

  get errorTitle() {
    return this.element.$(`~${MINIMIZED_ERROR_TITLE}`);
  }
}

module.exports = RootBetslipSO;
