const { SINGLE, SINGLE_CONTROLS } = require("@ppb/tbd-shared/components/Betslip/Single/Single.native.selectors");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SingleSO extends BaseSO {
  /**
   * Creates a sportsbook single card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${SINGLE}`));
  }

  get controls() {
    return this.element.$(`~${SINGLE_CONTROLS}`);
  }

  get alert() {
    return this.element.$(`~${ALERT}`);
  }
}

module.exports = SingleSO;
