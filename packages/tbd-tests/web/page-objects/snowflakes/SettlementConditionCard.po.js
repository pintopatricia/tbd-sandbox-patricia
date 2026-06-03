const {
  CONTAINER,
  TITLE,
  LABEL,
} = require("@ppb/tbd-shared/components/Betslip/ObbMultiple/snowflakes/SettlementConditionCard/SettlementConditionCard.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class SettlementConditionCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(CONTAINER));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get label() {
    return this.element.$(LABEL);
  }
}

module.exports = SettlementConditionCardPO;
