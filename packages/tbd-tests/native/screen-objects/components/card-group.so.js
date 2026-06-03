const { TEST_ID, HEADER, TITLE } = require("@ppb/the-wall-native/components/CardGroup/CardGroup.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get header() {
    return this.element.$(`~${HEADER}`);
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }
}

module.exports = CardGroupSO;
