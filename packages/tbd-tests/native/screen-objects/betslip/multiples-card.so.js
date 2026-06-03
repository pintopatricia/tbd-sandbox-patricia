const {
  ONE_LINE_MULTIPLE,
  NOTIFICATION,
} = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

// there are several tests disabled that uses this SO, this SO should be removed and used the OneLineMultipleSO instead

class MultiplesCardSO extends BaseSO {
  /**
   * Creates a multiples card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${ONE_LINE_MULTIPLE}`));
  }

  get multiplesNotifications() {
    return this.element.$$(`~${NOTIFICATION}`);
  }
}

module.exports = MultiplesCardSO;
