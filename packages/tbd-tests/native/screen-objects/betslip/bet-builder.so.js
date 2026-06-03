const {
  BET_BUILDER,
  SUBTITLE,
  TITLE,
} = require("@ppb/tbd-shared/components/Betslip/BetBuilder/BetBuilder.native.selectors");
const { BET_LEGS } = require("@ppb/tbd-shared/components/Betslip/BetLegs/BetLegs.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetBuilderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_BUILDER}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${SUBTITLE}`);
  }

  get betLegs() {
    return this.element.$$(`~${BET_LEGS}`);
  }
}

module.exports = BetBuilderSO;
