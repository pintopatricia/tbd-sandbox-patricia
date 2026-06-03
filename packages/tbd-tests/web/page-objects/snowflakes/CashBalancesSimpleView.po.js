const {
  TEST_ID,
  BALANCE_TITLE,
  BALANCE_AMOUNT,
  BALANCE_HIDDEN,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/CashBalancesSimpleView/CashBalancesSimpleView.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CashBalancesSimpleViewPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get balanceTitles() {
    return this.element.$$(BALANCE_TITLE);
  }

  get balanceAmounts() {
    return this.element.$$(BALANCE_AMOUNT);
  }

  get hiddenBalances() {
    return this.element.$$(BALANCE_HIDDEN);
  }
}

module.exports = CashBalancesSimpleViewPO;
