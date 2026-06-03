const {
  TEST_ID: EXTRA_WALLET_CARD_GROUP,
  EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT,
  OPTION_TITLE,
} = require("@ppb/tbd-shared/components/ExtraWalletCardGroup/ExtraWalletCardGroup.web.selectors");

const {
  TEST_ID: EXTRA_WALLET_CARD,
} = require("@ppb/tbd-shared/components/ExtraWalletCard/ExtraWalletCard.web.selectors");

const { TEST_ID: OPTION } = require("@ppb/the-wall-web/components/walls/Option/Option.selectors");
const { TEST_ID: ALERT } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

class ExpandableCardGroupPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(EXTRA_WALLET_CARD_GROUP));
  }

  get generosityAmount() {
    return this.element.$(EXTRA_WALLET_CARD_GROUP_FREE_BETS_AMOUNT);
  }

  get generosityAmountOption() {
    return this.generosityAmount.$(OPTION);
  }

  get helpUrlAlert() {
    return this.element.$(ALERT);
  }

  get extraWalletCardItems() {
    return this.element.$$(EXTRA_WALLET_CARD);
  }

  get optionTitle() {
    return this.element.$(OPTION_TITLE);
  }
}

module.exports = ExpandableCardGroupPO;
