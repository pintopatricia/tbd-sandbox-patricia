const {
  BET_LEGS,
  SELECTION,
  DESCRIPTION,
} = require("@ppb/tbd-shared/components/Betslip/BetLegs/BetLegs.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetLegsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_LEGS}`));
  }

  get description() {
    return this.element.$(`~${DESCRIPTION}`);
  }

  get selections() {
    return this.element.$$(`~${SELECTION}`);
  }
}

module.exports = BetLegsSO;
