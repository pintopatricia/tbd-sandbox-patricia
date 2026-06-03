const { BaseSO } = require("@ppb/wdio-lazy-element");
const {
  TERRITORY_BLOCKING_PAGE,
  LOGO,
  TITLE,
  MESSAGE,
  INFO,
  HELP_ICON,
} = require("./BetfairTerritoryBlockingPage.native.selectors");

class BetfairTerritoryBlockingPageSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TERRITORY_BLOCKING_PAGE}`));
  }

  get logo() {
    return this.element.$(`~${LOGO}`);
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

  get helpIcon() {
    return this.element.$(`~${HELP_ICON}`);
  }
}

module.exports = BetfairTerritoryBlockingPageSO;
