const { BaseSO } = require("@ppb/wdio-lazy-element");
const { TERRITORY_BLOCKING_PAGE, TITLE, MESSAGE, INFO } = require("./SkybetTerritoryBlockingPage.native.selectors");

class SkybetTerritoryBlockingPageSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TERRITORY_BLOCKING_PAGE}`));
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get message() {
    return this.element.$(`~${MESSAGE}`);
  }

  get info() {
    return this.element.$(`~${INFO}`);
  }
}

module.exports = SkybetTerritoryBlockingPageSO;
