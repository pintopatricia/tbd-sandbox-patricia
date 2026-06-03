const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/OptionList/OptionList.selectors");
const {
  CHECKBOX_INPUT,
  CHECKBOX_INPUT_SELECTED,
} = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const { ITEM_TITLE } = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class OptionListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns the label of each item
   * Uses the `ITEM_TITLE` selector
   */
  get itemText() {
    return this.element.$$(ITEM_TITLE);
  }

  /**
   * Returns the input of each item
   * Uses the `CHECKBOX_INPUT` selector
   */
  get itemInput() {
    return this.element.$$(CHECKBOX_INPUT);
  }

  /**
   * Returns the selected state of each item
   * Uses the `CHECKBOX_INPUT_SELECTED` selector
   */
  get itemSelected() {
    return this.element.$$(CHECKBOX_INPUT_SELECTED);
  }
};
