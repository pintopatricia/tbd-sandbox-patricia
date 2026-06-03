const {
  TEST_ID,
  LIST_ITEMS_LABEL_OPTION,
  LIST_ITEMS_INPUT,
  LIST_ITEM_SELECTED,
  LIST_ITEMS_ICON,
  LIST_ITEMS,
} = require("@ppb/the-wall-web/components/bricks/RadioList/RadioList.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RadioListPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Returns all the labels of each item
   * Uses the `LIST_ITEMS_LABEL_OPTION` selector
   */
  get itemText() {
    return this.element.$$(LIST_ITEMS_LABEL_OPTION);
  }

  /**
   * Returns all the input of each item
   * Uses the `LIST_ITEMS_INPUT` selector
   */
  get itemInput() {
    return this.element.$$(LIST_ITEMS_INPUT);
  }

  /**
   * Returns the selected state of each item
   * Uses the `LIST_ITEM_SELECTED` selector
   */
  get itemSelected() {
    return this.element.$(LIST_ITEM_SELECTED);
  }

  /**
   * Returns the icon of each item
   * Uses the `LIST_ITEMS_ICON` selector
   */
  get itemIcon() {
    return this.element.$$(LIST_ITEMS_ICON);
  }

  /**
   * Returns all the items
   * Uses the `LIST_ITEMS` selector
   */
  get listItems() {
    return this.element.$$(LIST_ITEMS);
  }
};
