const PopularSelectionsCardSelectors = require("@ppb/tbd-components-sports-betting/components/PopularSelections/view/PopularSelections.selectors");
const SportsbookBetButtonSelectors = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PopularSelectionsCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PopularSelectionsCardSelectors.CONTAINER}`));
  }

  get selectionItems() {
    return this.element.$$(`~${PopularSelectionsCardSelectors.SELECTION_ITEM}`);
  }

  runnerName(selectionItem) {
    return selectionItem.$(`~${PopularSelectionsCardSelectors.RUNNER_NAME}`);
  }

  marketName(selectionItem) {
    return selectionItem.$(`~${PopularSelectionsCardSelectors.MARKET_NAME}`);
  }

  betButton(selectionItem) {
    return selectionItem.$(`~${SportsbookBetButtonSelectors.TEST_ID}`);
  }

  betButtonOdd(selectionItem) {
    return selectionItem.$(`~${SportsbookBetButtonSelectors.LABEL}`);
  }
}

module.exports = PopularSelectionsCardSO;
