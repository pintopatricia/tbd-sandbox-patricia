const { BaseSO } = require("@ppb/wdio-lazy-element");
const { MARKET_RULES } = require("./MarketRules.native.selectors");

/**
 * Class that represents the Market Rules SO
 */
class MarketRulesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_RULES}`));
  }
}

module.exports = MarketRulesSO;
