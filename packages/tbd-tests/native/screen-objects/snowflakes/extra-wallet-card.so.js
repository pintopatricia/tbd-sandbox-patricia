const {
  EXTRA_WALLET_CARD,
  EXTRA_WALLET_CARD_BADGES,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/ExtraWalletCard.native.selectors");
const { OPTION } = require("@ppb/the-wall-native/components/Option/Option.selectors");
const {
  COUNTDOWN,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/snowflakes/Countdown/Countdown.native.selectors");
const { INFO_LABEL_LABEL } = require("@ppb/the-wall-native/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class ExtraWalletCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EXTRA_WALLET_CARD}`));
  }

  get walletOption() {
    return this.element.$(`~${OPTION}`);
  }

  get restrictionBadgesContainer() {
    return this.element.$(`~${EXTRA_WALLET_CARD_BADGES}`);
  }

  get restrictionBadges() {
    return this.restrictionBadgesContainer.$$(`~${INFO_LABEL_LABEL}`);
  }

  get countdown() {
    return this.element.$(`~${COUNTDOWN}`);
  }
}

module.exports = ExtraWalletCardSO;
