const {
  RADIO_LIST,
  LIST_ITEMS_TEXT,
  LIST_ITEM,
} = require("@ppb/the-wall-native/components/RadioList/RadioList.selectors");
const { RADIO_BUTTON } = require("@ppb/the-wall-native/components/RadioButton/RadioButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RadioListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RADIO_LIST}`));
  }

  /**
   * Returns the label of each item
   * Uses the `LIST_ITEMS_TEXT` selector
   */
  get itemText() {
    return this.element.$$(`~${LIST_ITEMS_TEXT}`);
  }

  /**
   * Returns each item
   * Uses the `LIST_ITEM` selector
   */
  get item() {
    return this.element.$$(`~${LIST_ITEM}`);
  }

  /**
   * Returns each items radio button
   * Uses the `RADIO_BUTTON` selector
   */
  get radioButtons() {
    return this.element.$$(`~${RADIO_BUTTON}`);
  }
}

module.exports = RadioListSO;
