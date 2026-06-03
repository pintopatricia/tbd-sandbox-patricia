const {
  COUNTDOWN,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/snowflakes/Countdown/Countdown.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class Countdown extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COUNTDOWN}`));
  }
}

module.exports = Countdown;
