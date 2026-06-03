const {
  TEST_ID,
  NOTIFICATION,
} = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

// there are several tests disabled that uses this SO, this SO should be removed and used the OneLineMultipleSO instead

class MultiplesCardPO extends BasePO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get multiplesNotifications() {
    return this.element.$$(NOTIFICATION);
  }
}

module.exports = MultiplesCardPO;
