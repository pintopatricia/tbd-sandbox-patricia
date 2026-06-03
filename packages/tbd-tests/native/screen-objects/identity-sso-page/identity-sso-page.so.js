const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  LOGIN_FIELD_CONTAINER,
  LOGIN_USERNAME,
  LOGIN_PASSWORD,
  LOGIN_BUTTON,
} = require("./identity-sso-page.selectors");

class IdentitySsoPageSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $$(`~${LOGIN_FIELD_CONTAINER}`));
  }

  get username() {
    return $(`~${LOGIN_USERNAME}`);
  }

  get password() {
    return $(`~${LOGIN_PASSWORD}`);
  }

  get loginButton() {
    return $(`~${LOGIN_BUTTON}`);
  }
}

module.exports = IdentitySsoPageSO;
