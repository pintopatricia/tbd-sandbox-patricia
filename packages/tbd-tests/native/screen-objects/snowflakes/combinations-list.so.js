const {
  COMBINATIONS_LIST,
  COMBINATIONS_LIST_HEADER,
  COMBINATIONS_LIST_HEADER_TITLE,
  COMBINATIONS_LIST_MORE,
  COMBINATIONS_LIST_MORE_LABEL,
  COMBINATIONS_LINE_ROW,
} = require("@ppb/tbd-shared/components/Betslip/Preview/snowflakes/CombinationsList/CombinationsList.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CombinationsListSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COMBINATIONS_LIST}`));
  }

  get header() {
    return this.element.$(`~${COMBINATIONS_LIST_HEADER}`);
  }

  get headerTitle() {
    return this.element.$(`~${COMBINATIONS_LIST_HEADER_TITLE}`);
  }

  get more() {
    return this.element.$(`~${COMBINATIONS_LIST_MORE}`);
  }

  get moreLabel() {
    return this.element.$(`~${COMBINATIONS_LIST_MORE_LABEL}`);
  }

  get lineRows() {
    return this.element.$$(`~${COMBINATIONS_LINE_ROW}`);
  }
}

module.exports = CombinationsListSO;
