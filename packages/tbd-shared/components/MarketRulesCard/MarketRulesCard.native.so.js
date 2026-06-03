const { BaseSO } = require("@ppb/wdio-lazy-element");
const { MARKET_RULES_CARD } = require("./MarketRulesCard.native.selectors");

/**
 * Class that represents the Market Rules SO
 */
class MarketRulesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_RULES_CARD}`));
  }
}

module.exports = MarketRulesSO;
