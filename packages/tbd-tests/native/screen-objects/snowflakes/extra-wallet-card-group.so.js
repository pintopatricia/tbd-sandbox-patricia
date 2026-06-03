const {
  EXTRA_WALLET_CARD_GROUP,
  EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT,
} = require("@ppb/tbd-shared/components/ExtraWalletCardGroup/ExtraWalletCardGroup.native.selectors");
const { EXTRA_WALLET_CARD } = require("@ppb/tbd-shared/components/ExtraWalletCard/ExtraWalletCard.native.selectors");
const { OPTION } = require("@ppb/the-wall-native/components/Option/Option.selectors");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExtraWalletCardGroupSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXTRA_WALLET_CARD_GROUP}`));
  }

  get generosityAmount() {
    return this.element.$(`~${EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT}`);
  }

  get generosityAmountOption() {
    return this.element.$(`~${OPTION}`);
  }

  get helpUrlAlert() {
    return this.element.$(`~${ALERT}`);
  }

  get extraWalletCardItems() {
    return this.element.$$(`~${EXTRA_WALLET_CARD}`);
  }
}

module.exports = ExtraWalletCardGroupSO;
