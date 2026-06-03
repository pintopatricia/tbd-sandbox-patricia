const {
  ICON_CONTAINER,
  HORSE_RUNNER_SILK,
  HORSE_RUNNER_SILK_DEFAULT,
} = require("@ppb/the-wall-native/components/bricks/SilkWrapper/SilkWrapper.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SilkWrapperSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${ICON_CONTAINER}`));
  }

  get horseRunnerSilk() {
    return this.element.$(`~${HORSE_RUNNER_SILK}`);
  }

  get horseRunnerDefaultSilk() {
    return this.element.$(`~${HORSE_RUNNER_SILK_DEFAULT}`);
  }
}

module.exports = SilkWrapperSO;
