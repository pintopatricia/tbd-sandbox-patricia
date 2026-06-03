const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID,
  PREFERENCE_CARD,
  HEADER_TITLE,
  OPTION_HINT,
  RADIO_LIST,
  LIST_ITEM,
  LIST_ITEM_INPUT_OPTION,
  TOGGLE_CONTAINER,
} = require("./PreferenceSingleChoiceCard.web.selectors");

module.exports = class PreferenceSingleChoiceCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get preferenceCard() {
    return this.element.$(PREFERENCE_CARD);
  }

  get headerTitle() {
    return this.element.$(HEADER_TITLE);
  }

  get optionHint() {
    return this.element.$(OPTION_HINT);
  }

  get radioList() {
    return this.element.$$(RADIO_LIST);
  }

  get listItem() {
    return this.element.$$(LIST_ITEM);
  }

  get listItemInputOption() {
    return this.element.$$(LIST_ITEM_INPUT_OPTION);
  }

  get toggleContainer() {
    return this.element.$(TOGGLE_CONTAINER);
  }
};
