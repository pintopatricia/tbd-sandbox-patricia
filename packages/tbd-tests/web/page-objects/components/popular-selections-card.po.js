const PopularSelectionsCardSelectors = require("@ppb/tbd-components-sports-betting/components/PopularSelections/view/PopularSelections.selectors");
const SportsbookBetButtonSelectors = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PopularSelectionsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`[data-testid="${PopularSelectionsCardSelectors.CONTAINER}"]`));
  }

  get selectionItems() {
    return this.element.$$(`[data-testid="${PopularSelectionsCardSelectors.SELECTION_ITEM}"]`);
  }

  runnerName(selectionItem) {
    return selectionItem.$(`[data-testid="${PopularSelectionsCardSelectors.RUNNER_NAME}"]`);
  }

  marketName(selectionItem) {
    return selectionItem.$(`[data-testid="${PopularSelectionsCardSelectors.MARKET_NAME}"]`);
  }

  betButton(selectionItem) {
    return selectionItem.$(SportsbookBetButtonSelectors.TEST_ID);
  }

  betButtonOdd(selectionItem) {
    return selectionItem.$(SportsbookBetButtonSelectors.TEST_ID).$(SportsbookBetButtonSelectors.LABEL);
  }
}

module.exports = PopularSelectionsCardPO;
