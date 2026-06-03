const {
  MARKET_RULES_SECTION,
  TITLE,
} = require("@ppb/tbd-shared/components/MarketRulesCard/MarketRules/MarketRulesSection/MarketRulesSection.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MarketRulesSectionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_RULES_SECTION}`));
  }

  /**
   * Returns the title element
   */
  get title() {
    return this.element.$(`~${TITLE}`);
  }
}

module.exports = MarketRulesSectionSO;
