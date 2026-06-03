const { TEST_ID } = require("@ppb/the-wall-web/components/walls/ReceiptTitle/ReceiptTitle.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ReceiptTitlePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ReceiptTitlePO;
