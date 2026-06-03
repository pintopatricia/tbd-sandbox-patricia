const { CLOCK, CLOCK_TEXT } = require("@ppb/tbd-shared/components/UserProfile/snowflakes/Clock/Clock.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ClockSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CLOCK}`));
  }

  get text() {
    return this.element.$(`~${CLOCK_TEXT}`);
  }
}

module.exports = ClockSO;
