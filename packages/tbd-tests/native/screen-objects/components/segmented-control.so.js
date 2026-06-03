const {
  CONTAINER,
  SELECTABLE_OPTION,
  SELECTABLE_OPTION_TEXT,
  SELECTABLE_SELECTED_OPTION_TEXT,
} = require("@ppb/the-wall-native/components/SegmentedControl/SegmentedControl.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SegmentedControlSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CONTAINER}`));
  }

  get options() {
    return this.element.$$(`~${SELECTABLE_OPTION}`);
  }

  get selectedOptionText() {
    return this.element.$(`~${SELECTABLE_SELECTED_OPTION_TEXT}`);
  }

  get optionText() {
    return this.element.$(`~${SELECTABLE_OPTION_TEXT}`);
  }
}

module.exports = SegmentedControlSO;
