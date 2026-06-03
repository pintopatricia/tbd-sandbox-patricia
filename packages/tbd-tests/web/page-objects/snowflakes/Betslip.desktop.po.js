const {
  TEST_ID,
  TITLE,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/DesktopBetslip/DesktopBetslip.web.selectors.js");

const { BasePO } = require("@ppb/wdio-lazy-element");

class DesktopBetslipPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }
}

module.exports = DesktopBetslipPO;
