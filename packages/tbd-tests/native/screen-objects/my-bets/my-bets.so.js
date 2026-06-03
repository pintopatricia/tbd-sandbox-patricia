const {
  MY_BETS_PAGE,
  MY_BETS_PAGE_EMPTY_STATE,
} = require("@ppb/tbd-shared/components/MyBetsPage/MyBetsPage.native.selectors");
const {
  MY_BETS_HEADER,
} = require("@ppb/tbd-shared/components/MyBetsPage/snowflakes/MyBetsHeader/MyBetsHeader.native.selectors");
const { BET_CARD_GROUP } = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.selectors");
const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { SNACKBAR } = require("@ppb/the-wall-native/components/Betslip/Snackbar/Snackbar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { SnackbarSO } = require("..");

module.exports = class MyBetsScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MY_BETS_PAGE}`));
  }

  get header() {
    return this.element.$(`~${MY_BETS_HEADER}`);
  }

  get betCardGroups() {
    return this.element.$$(`~${BET_CARD_GROUP}`);
  }

  get emptyState() {
    return this.element.$(`~${MY_BETS_PAGE_EMPTY_STATE}`);
  }

  get sbkBetPanelsCollapsable() {
    return this.element.$$(`~${CARD}`);
  }

  get snackbars() {
    return this.element.$$(`~${SNACKBAR}`);
  }

  async closeSnackbars() {
    try {
      const snackbarsTotal = await this.snackbars.length;
      const snackbarSO = new SnackbarSO();

      for (let i = 0; i < snackbarsTotal; i += 1) {
        await browser.waitUntilClickableNative(snackbarSO.closeButton, "The toast's close button was not clickable");
        await snackbarSO.closeButton.click();
      }
    } catch {
      // no more snackbars to close
    }
  }
};
