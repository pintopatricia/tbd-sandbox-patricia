const { TEST_ID, ALERTS_ITEMS } = require("@ppb/the-wall-web/components/walls/Alerts/Alerts.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class AlertsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get items() {
    return this.element.$$(ALERTS_ITEMS);
  }
}

module.exports = AlertsPO;
