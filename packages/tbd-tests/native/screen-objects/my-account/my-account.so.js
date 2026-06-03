const { BaseSO } = require("@ppb/wdio-lazy-element");

const { MY_ACCOUNT_SCREEN, TITLE } = require("./my-account.selectors");

class HomeScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MY_ACCOUNT_SCREEN}`));
  }

  get title() {
    return $$(`~${TITLE}`);
  }
}

module.exports = HomeScreenSO;
