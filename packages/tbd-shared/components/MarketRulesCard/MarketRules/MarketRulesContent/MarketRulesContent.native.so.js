const { ACTION_LINK } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const { MARKET_RULES_SECTION } = require("../MarketRulesSection/MarketRulesSection.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  MARKET_RULES_CONTENT,
  MARKET_BASE_RATE,
  DISCOUNT_ALLOWED,
  EVENT_START_TIME,
  CONTENT,
  FOOTER,
} = require("./MarketRulesContent.native.selectors");

/**
 * Class that represents the Market Rules SO
 */
class MarketRulesContentSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MARKET_RULES_CONTENT}`));
  }

  get sections() {
    return this.element.$$(`~${MARKET_RULES_SECTION}`);
  }

  get marketBaseRate() {
    return this.element.$(`~${MARKET_BASE_RATE}`);
  }

  get discountAllowed() {
    return this.element.$(`~${DISCOUNT_ALLOWED}`);
  }

  get discountRateExplained() {
    return this.element.$(`~${ACTION_LINK}`);
  }

  get eventStartTime() {
    return this.element.$(`~${EVENT_START_TIME}`);
  }

  get contentList() {
    return this.element.$$(`~${CONTENT}`);
  }

  get footer() {
    return this.element.$(`~${FOOTER}`);
  }
}

module.exports = MarketRulesContentSO;
