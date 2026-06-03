const {
  EXPANDABLE,
  EXPANDABLE_HEADER,
} = require("@ppb/the-wall-native/components/Betslip/Expandable/Expandable.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExpandableSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXPANDABLE}`));
  }

  get header() {
    return this.element.$(`~${EXPANDABLE_HEADER}`);
  }
}

module.exports = ExpandableSO;
