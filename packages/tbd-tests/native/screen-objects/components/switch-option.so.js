const {
  SWITCH_OPTION,
  SWITCH_OPTION_LABEL,
} = require("@ppb/the-wall-native/components/SwitchOption/SwitchOption.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SwitchOptionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SWITCH_OPTION}`));
  }

  get switchOptionLabel() {
    return this.element.$(`~${SWITCH_OPTION_LABEL}`);
  }
}

module.exports = SwitchOptionSO;
