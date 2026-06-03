const DrawsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/Draws/Draws.selectors");
const LottoBallsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoBalls/LottoBalls.selectors");
const LottoSelecttionsSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/snowflakes/LottoSelections/LottoSelections.selectors");
const LottoCardSelectors = require("@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.selectors");
const RoundButtonSelectors = require("@ppb/the-wall-web/components/bricks/RoundButton/RoundButton.selectors");
const SportsbookBetButtonSelectors = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const CardPO = require("./card.po");

class LottoCardPO extends CardPO {
  get luckyDip() {
    return this.element.$(`[data-testid="${LottoCardSelectors.LUCKY_DIP}"]`);
  }

  get quickPicks() {
    return this.luckyDip.$$(SportsbookBetButtonSelectors.TEST_ID);
  }

  get drawsContainer() {
    return this.element.$(`[data-testid="${DrawsSelectors.TEST_ID}"]`);
  }

  get lottoBallsContainer() {
    return this.element.$(`[data-testid="${LottoBallsSelectors.TEST_ID}"]`);
  }

  get lottoBalls() {
    return this.lottoBallsContainer.$$(RoundButtonSelectors.TEST_ID);
  }

  get selectionsContainer() {
    return this.element.$(`[data-testid="${LottoSelecttionsSelectors.TEST_ID}"]`);
  }

  get lottoSelections() {
    return this.selectionsContainer.$$(RoundButtonSelectors.TEST_ID);
  }
}

module.exports = LottoCardPO;
