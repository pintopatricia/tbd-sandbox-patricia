const LottoCardSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.selectors");
const DrawsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/Draws/Draws.selectors");
const LottoSelectionsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.selectors");
const RoundButtonSelectors = require("@ppb/the-wall-native/components/RoundButton/RoundButton.selectors");
const SportsbookBetButtonSelectors = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const ActionLinkSelectors = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const LottoBallsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoBalls/LottoBalls.selectors");
const { TEST_ID: CARD_GROUP } = require("@ppb/the-wall-native/components/CardGroup/CardGroup.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class LottoCardNativeSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CARD_GROUP}`));
  }

  get luckyDip() {
    return this.element.$(`~${LottoCardSelectors.LUCKY_DIP}`);
  }

  get clearAll() {
    return this.luckyDip.$(`~${ActionLinkSelectors.ACTION_LINK}`);
  }

  get quickPicks() {
    return this.luckyDip.$$(`~${SportsbookBetButtonSelectors.TEST_ID}`);
  }

  get drawsContainer() {
    return this.element.$(`~${DrawsSelectors.TEST_ID}`);
  }

  get lottoBallsContainer() {
    return this.element.$(`~${LottoBallsSelectors.TEST_ID}`);
  }

  get lottoBalls() {
    return this.lottoBallsContainer.$$(`~${RoundButtonSelectors.TEST_ID}`);
  }

  get selectionsContainer() {
    return this.element.$(`~${LottoSelectionsSelectors.TEST_ID}`);
  }

  get lottoSelections() {
    return this.selectionsContainer.$$(`~${RoundButtonSelectors.TEST_ID}`);
  }
}

module.exports = LottoCardNativeSO;
