const { BaseSO } = require("@ppb/wdio-lazy-element");

const { PRICE_BOOST_MULTIPLE } = require("./PriceBoostMultiple.native.selectors");

class PriceBoostMultipleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PRICE_BOOST_MULTIPLE}`));
  }
}

module.exports = PriceBoostMultipleSO;
