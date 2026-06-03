const { TIMER } = require("@ppb/tbd-shared/components/TimerCountDown/snowflakes/Timer/Timer.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class Timer extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIMER}`));
  }
}

module.exports = Timer;
