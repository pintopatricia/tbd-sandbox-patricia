const {
  TEST_ID,
  OPTION_TITLE,
  OPTION_SUBTITLE,
  OPTION_TOGGLE,
  OPTION_ICON,
} = require("@ppb/the-wall-native/components/Option/Option.selectors");

const {
  CHECKBOX_BUTTON,
  CHECKBOX_SELECTED,
  CHECKBOX_READONLY,
} = require("@ppb/the-wall-native/components/bricks/Checkbox/Checkbox.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class OptionSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get title() {
    return this.element.$(`~${OPTION_TITLE}`);
  }

  get subtitle() {
    return this.element.$(`~${OPTION_SUBTITLE}`);
  }

  get icon() {
    return this.element.$(`~${OPTION_ICON}`);
  }

  get checkbox() {
    return this.element.$(`~${CHECKBOX_BUTTON}`);
  }

  get toggle() {
    return this.element.$(`~${OPTION_TOGGLE}`);
  }

  get checkmark() {
    return this.element.$(`~${CHECKBOX_SELECTED}`);
  }

  get checkmarkReadOnly() {
    return this.element.$(`~${CHECKBOX_READONLY}`);
  }
}

module.exports = OptionSO;
