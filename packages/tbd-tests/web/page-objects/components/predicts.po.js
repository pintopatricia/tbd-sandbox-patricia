const { TEST_ID } = require("@ppb/tbd-shared/components/Predicts/Predicts.web.selectors");
const loadingStyles = require("@ppb/tbd-shared/components/Predicts/PredictsLoading/PredictsLoading.web.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PredictsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the Predicts loading screen element.
   */
  get loadingScreen() {
    return this.element.$(loadingStyles.predictsLoading);
  }
}

module.exports = PredictsPO;
