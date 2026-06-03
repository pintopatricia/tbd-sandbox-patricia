const { COUNTER, COUNTER_VALUE } = require("@ppb/the-wall-native/components/Counter/Counter.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CounterSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUNTER}`));
  }

  get value() {
    return this.element.$(`~${COUNTER_VALUE}`);
  }
}

module.exports = CounterSO;
