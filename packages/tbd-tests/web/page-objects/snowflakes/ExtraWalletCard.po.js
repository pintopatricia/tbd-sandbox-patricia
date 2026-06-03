const {
  TEST_ID: EXTRA_WALLET_CARD,
  EXTRA_WALLET_CARD_BADGES,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/ExtraWalletCard.web.selectors");

const {
  TEST_ID: COUNTDOWN,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/snowflakes/Countdown/Countdown.web.selectors");

const { TEST_ID: OPTION } = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");

const { TEST_ID: INFO_LABEL } = require("@ppb/the-wall-web/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class ExpandableCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(EXTRA_WALLET_CARD));
  }

  get walletOption() {
    return this.element.$(OPTION);
  }

  get restrictionBadgesContainer() {
    return this.element.$(EXTRA_WALLET_CARD_BADGES);
  }

  get restrictionBadges() {
    return this.restrictionBadgesContainer.$$(INFO_LABEL);
  }

  get countdown() {
    return this.element.$(COUNTDOWN);
  }
}

module.exports = ExpandableCardGroupPO;
