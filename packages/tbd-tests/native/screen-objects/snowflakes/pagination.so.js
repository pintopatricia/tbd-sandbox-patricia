const { PAGINATION, PAGINATION_DOT } = require("@ppb/the-wall-native/components/Pagination/Pagination.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PaginationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PAGINATION}`));
  }

  get dots() {
    return this.element.$$(`~${PAGINATION_DOT}`);
  }
}

module.exports = PaginationSO;
