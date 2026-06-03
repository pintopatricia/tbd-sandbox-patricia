const {
  TEST_ID,
  BALANCE_TITLE,
  BALANCE_TOGGLE,
  ICON_CONTAINER,
  BALANCES_CONTAINER,
  CASH_BALANCE_SIMPLE_VIEW,
  CASH_BALANCE_DETAILED_VIEW,
} = require("@ppb/tbd-shared/components/UserProfile/snowflakes/CashBalances/CashBalances.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CashBalancesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get balanceTitle() {
    return this.element.$(BALANCE_TITLE);
  }

  get balanceAmount() {
    return this.element.$(BALANCE_TOGGLE);
  }

  get iconContainer() {
    return this.element.$(ICON_CONTAINER);
  }

  get balancesContainer() {
    return this.element.$(BALANCES_CONTAINER);
  }

  get cashBalanceSimpleView() {
    return this.element.$(CASH_BALANCE_SIMPLE_VIEW);
  }

  get cashBalanceDetailedView() {
    return this.element.$(CASH_BALANCE_DETAILED_VIEW);
  }
}

module.exports = CashBalancesPO;
