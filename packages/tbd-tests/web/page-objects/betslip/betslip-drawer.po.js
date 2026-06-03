const { TEST_ID } = require("@ppb/the-wall-web/components/walls/Drawer/Drawer.selectors");
const {
  BETSLIP_DRAWER_HEADER,
} = require("@ppb/tbd-shared/components/Betslip/RootBetslip/snowflakes/BetslipDrawer/BetslipDrawer.web.selectors");
const { TEST_ID: CARD_ID } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetslipDrawerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get header() {
    return this.element.$(BETSLIP_DRAWER_HEADER);
  }

  get cards() {
    return this.element.$$(CARD_ID);
  }
}

module.exports = BetslipDrawerPO;
