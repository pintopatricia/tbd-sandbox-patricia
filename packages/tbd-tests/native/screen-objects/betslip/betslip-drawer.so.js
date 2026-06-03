const {
  BETSLIP_DRAWER,
  BETSLIP_DRAWER_HEADER,
  BETSLIP_DRAWER_CONTENT,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/BetslipDrawer/BetslipDrawer.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetslipDrawerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BETSLIP_DRAWER}`));
  }

  get header() {
    return this.element.$(`~${BETSLIP_DRAWER_HEADER}`);
  }

  get content() {
    return this.element.$(`~${BETSLIP_DRAWER_CONTENT}`);
  }
}

module.exports = BetslipDrawerSO;
