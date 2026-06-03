const {
  FIXED_PREFIX_COMPONENT,
  PREVIOUS_VALUE,
  ODDS_MOVEMENT_CONTAINER,
} = require("@ppb/the-wall-native/components/InputsAndControls/FixedNumberInputField/ValueIndicator/ValueIndicator.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ValueIndicatorSO extends BaseSO {
  /**
   * Creates a prefix component page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${FIXED_PREFIX_COMPONENT}`));
  }

  get previousValue() {
    return this.element.$(`${PREVIOUS_VALUE}`);
  }

  get oddsMovementContainer() {
    return this.element.$(`${ODDS_MOVEMENT_CONTAINER}`);
  }
}

module.exports = ValueIndicatorSO;
