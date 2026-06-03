const { FILTER, FILTER_BY, RESET_BUTTON } = require("@ppb/the-wall-native/components/FilterBy/FilterBy.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FilterBySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FILTER_BY}`));
  }

  get filters() {
    return this.element.$$(`~${FILTER}`);
  }

  get resetButton() {
    return this.element.$(`~${RESET_BUTTON}`);
  }
}

module.exports = FilterBySO;
