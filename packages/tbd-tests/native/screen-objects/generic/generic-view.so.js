const {
  GENERIC_VIEW,
  GENERIC_VIEW_HEADER,
  GENERIC_VIEW_ITEMS,
} = require("@ppb/tbd-shared/components/GenericView/GenericView.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GenericViewSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GENERIC_VIEW}`));
  }

  get header() {
    return this.element.$(`~${GENERIC_VIEW_HEADER}`);
  }

  get items() {
    return this.element.$$(`~${GENERIC_VIEW_ITEMS}`);
  }
}

module.exports = GenericViewSO;
