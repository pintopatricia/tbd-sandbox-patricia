const { SWITCH, SWITCH_BALL } = require("@ppb/the-wall-native/components/Switch/Switch.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SwitchSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SWITCH}`));
  }

  get switch() {
    return this.element.$(`~${SWITCH}`);
  }

  get switchBall() {
    return this.element.$(`~${SWITCH_BALL}`);
  }
}

module.exports = SwitchSO;
