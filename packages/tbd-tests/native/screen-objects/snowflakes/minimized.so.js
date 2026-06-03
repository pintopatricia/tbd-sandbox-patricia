const {
  MINIMIZED,
  MINIMIZED_TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/Minimized/Minimized.native.selectors");

const { COUNTER_VALUE } = require("@ppb/the-wall-native/components/Counter/Counter.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MinimizedSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MINIMIZED}`));
  }

  get counter() {
    return this.element.$(`~${COUNTER_VALUE}`);
  }

  get title() {
    return this.element.$(`~${MINIMIZED_TITLE}`);
  }
}

module.exports = MinimizedSO;
