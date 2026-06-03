const { TEST_ID } = require("@ppb/the-wall-web/components/walls/PromoCard/AutoFitH1/AutoFitH1.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class AutoFitH1PO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = AutoFitH1PO;
