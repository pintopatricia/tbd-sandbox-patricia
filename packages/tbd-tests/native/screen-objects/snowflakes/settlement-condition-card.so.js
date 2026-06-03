const {
  CONTAINER,
  TITLE,
  LABEL,
} = require("@ppb/tbd-shared/components/Betslip/ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class SettlementConditionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CONTAINER}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get label() {
    return this.element.$(`~${LABEL}`);
  }
}

module.exports = SettlementConditionCardSO;
