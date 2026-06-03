const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/ObbSingle/ObbSingle.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ObbSingleCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ObbSingleCardPO;
