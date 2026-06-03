const { BaseSO } = require("@ppb/wdio-lazy-element");

const { MY_ACCOUNT_HEADER } = require("./my-account.selectors");

class HeaderSectionTitleSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MY_ACCOUNT_HEADER}`));
  }
}

module.exports = HeaderSectionTitleSO;
