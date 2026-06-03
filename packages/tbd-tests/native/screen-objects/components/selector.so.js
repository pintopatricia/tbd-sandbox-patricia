const { SELECTOR, TEXT_SELECTOR } = require("@ppb/the-wall-native/components/Selector/Selector.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SelectorSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SELECTOR}`));
  }

  get title() {
    return this.element.$(`~${TEXT_SELECTOR}`);
  }
}

module.exports = SelectorSO;
