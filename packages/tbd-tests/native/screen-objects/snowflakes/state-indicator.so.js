const {
  STATE_INDICATOR,
  STATE_INDICATOR_SPINNER,
  STATE_INDICATOR_TITLE,
  STATE_INDICATOR_SUBTITLE,
} = require("@ppb/the-wall-native/components/bricks/Indicators/State/StateIndicator.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class StateIndicatorSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STATE_INDICATOR}`));
  }

  get spinner() {
    return this.element.$(`~${STATE_INDICATOR_SPINNER}`);
  }

  get title() {
    return this.element.$(`~${STATE_INDICATOR_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${STATE_INDICATOR_SUBTITLE}`);
  }
}

module.exports = StateIndicatorSO;
