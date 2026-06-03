const {
  HEADER,
  HEADER_LOGO,
  HEADER_BACK_BUTTON,
  HEADER_BALANCE_LABEL,
  HEADER_GENEROSITY_WALLET_PRESSABLE,
  HEADER_USER_PROFILE,
  HEADER_BALANCE_BUTTON,
  JOIN_NOW_BUTTON,
  LOGIN_BUTTON,
} = require("@ppb/tbd-shared/components/Header/snowflakes/Header/Header.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HeaderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HEADER}`));
  }

  get betfairLogo() {
    return this.element.$(`//*[@resource-id="${HEADER_LOGO}"]`);
  }

  get logo() {
    return this.element.$(`//*[@resource-id="${HEADER_LOGO}"]`);
  }

  get backButton() {
    return this.element.$(`~${HEADER_BACK_BUTTON}`);
  }

  get balanceButton() {
    return this.element.$(`~${HEADER_BALANCE_BUTTON}`);
  }

  get balance() {
    return this.element.$(`~${HEADER_BALANCE_LABEL}`);
  }

  get generosityWalletButton() {
    return this.element.$(`~${HEADER_GENEROSITY_WALLET_PRESSABLE}`);
  }

  get userProfile() {
    return this.element.$(`~${HEADER_USER_PROFILE}`);
  }

  get loginButton() {
    return this.element.$(`~${LOGIN_BUTTON}`);
  }

  get joinNowButton() {
    return this.element.$(`~${JOIN_NOW_BUTTON}`);
  }
}

module.exports = HeaderSO;
