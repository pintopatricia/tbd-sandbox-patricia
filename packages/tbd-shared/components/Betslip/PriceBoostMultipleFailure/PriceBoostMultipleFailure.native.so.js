const { BaseSO } = require("@ppb/wdio-lazy-element");

const { PRICE_BOOST_MULTIPLE_FAILURE } = require("./PriceBoostMultipleFailure.native.selectors");

class PriceBoostMultipleFailureSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PRICE_BOOST_MULTIPLE_FAILURE}`));
  }
}

module.exports = PriceBoostMultipleFailureSO;
