const {
  QUICK_STAKE,
  QUICK_STAKES_CONTAINER,
  QUICK_STAKE_LABEL,
} = require("@ppb/the-wall-native/components/QuickStakes/QuickStakes.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class QuickStakesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${QUICK_STAKES_CONTAINER}`));
  }

  get quickStake() {
    return this.element.$$(`~${QUICK_STAKE}`);
  }

  get quickStakeLabels() {
    return this.element.$$(`~${QUICK_STAKE_LABEL}`);
  }
}

module.exports = QuickStakesSO;
