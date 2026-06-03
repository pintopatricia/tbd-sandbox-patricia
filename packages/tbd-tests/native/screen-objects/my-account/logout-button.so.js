const { BaseSO } = require("@ppb/wdio-lazy-element");

const { LOGOUT_BUTTON } = require("./my-account.selectors");

class LogOutButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${LOGOUT_BUTTON}`));
  }
}

module.exports = LogOutButtonSO;
