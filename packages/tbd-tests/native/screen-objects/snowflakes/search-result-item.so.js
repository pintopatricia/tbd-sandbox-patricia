const {
  SEARCH_RESULT_ITEM,
  SEARCH_RESULT_ITEM_LOGO,
  SEARCH_RESULT_ITEM_TEXT_CONTEXT,
  SEARCH_RESULT_ITEM_TEXT_NAME,
  SEARCH_RESULT_ITEM_ICON,
} = require("@ppb/the-wall-native/components/SearchResultItem/SearchResultItem.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SearchResultItemSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SEARCH_RESULT_ITEM}`));
  }

  get logo() {
    return this.element.$(`~${SEARCH_RESULT_ITEM_LOGO}`);
  }

  get textContext() {
    return this.element.$(`~${SEARCH_RESULT_ITEM_TEXT_CONTEXT}`);
  }

  get textName() {
    return this.element.$(`~${SEARCH_RESULT_ITEM_TEXT_NAME}`);
  }

  get icon() {
    return this.element.$(`~${SEARCH_RESULT_ITEM_ICON}`);
  }
}

module.exports = SearchResultItemSO;
