const {
  PREDICTS_LOADING_SCREEN,
} = require("@ppb/tbd-shared/components/Predicts/PredictsLoading/PredictsLoading.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PredictsLoadingSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PREDICTS_LOADING_SCREEN}`));
  }
}

module.exports = PredictsLoadingSO;
