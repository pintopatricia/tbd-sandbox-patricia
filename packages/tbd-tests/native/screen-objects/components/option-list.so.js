const { OPTION_LIST, OPTION_SELECTION } = require("@ppb/the-wall-native/components/OptionList/OptionList.selectors");
const {
  CHECKBOX_SELECTED,
  CHECKBOX_BUTTON,
} = require("@ppb/the-wall-native/components/bricks/Checkbox/Checkbox.selectors");
const { OPTION_TITLE } = require("@ppb/the-wall-native/components/Option/Option.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class OptionListPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${OPTION_LIST}`));
  }

  /**
   * Returns all the options
   * Uses the `CHECKBOX_BUTTON` selector
   */
  get options() {
    return this.element.$$(`~${CHECKBOX_BUTTON}`);
  }

  /**
   * Returns the label of each option
   * Uses the `OPTION_TEXT` selector
   */
  get optionsText() {
    return this.element.$$(`~${OPTION_TITLE}`);
  }

  /**
   * Returns the selection of each option
   * Uses the `OPTION_SELECTION` selector
   */
  get optionsSelection() {
    return this.element.$$(`~${OPTION_SELECTION}`);
  }

  /**
   * Returns the selected options checkmark
   * Uses the `CHECKBOX_SELECTED` selector
   */
  get selectedOptions() {
    return this.element.$$(`~${CHECKBOX_SELECTED}`);
  }
};
