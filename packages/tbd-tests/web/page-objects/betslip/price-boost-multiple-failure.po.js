const {
  TEST_ID: PBM_FAILURE,
} = require("@ppb/tbd-shared/components/Betslip/PriceBoostMultipleFailure/PriceBoostMultipleFailure.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PriceBoostMultipleFailurePO extends BasePO {
  /**
   * Creates a price boost multiple failure card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(PBM_FAILURE));
  }
}

module.exports = PriceBoostMultipleFailurePO;
