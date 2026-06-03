const { TEST_ID, EMPTY_STATE } = require("@ppb/tbd-shared/components/MyBetsPage/MyBetsPage.web.selectors");
const { TEST_ID: BET_CARD_GROUPS } = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.selectors");
const { PRIMARY_BUTTON, LABEL } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");

const {
  TEST_ID: MY_BETS_HEADER,
} = require("@ppb/tbd-shared/components/MyBetsPage/snowflakes/MyBetsHeader/MyBetsHeader.web.selectors");
const { TEST_ID: SNACKBAR } = require("@ppb/the-wall-web/components/bricks/Snackbar/Snackbar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MyBetsPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get header() {
    return this.element.$(MY_BETS_HEADER);
  }

  get betCardGroups() {
    return this.element.$$(BET_CARD_GROUPS);
  }

  get cashoutButton() {
    return this.element.$(PRIMARY_BUTTON);
  }

  get cashoutButtons() {
    return this.element.$$(PRIMARY_BUTTON);
  }

  get cashoutButtonLabel() {
    return this.element.$(LABEL);
  }

  get emptyState() {
    return this.element.$(EMPTY_STATE);
  }

  get snackbars() {
    return this.element.$$(SNACKBAR);
  }
};
