const {
  BET_SELECTIONS,
  HEADER,
  CONTENT,
  SELECTION,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookReceipt/snowflakes/SportsbookReceiptPanel/snowflakes/BetSelections/BetSelections.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class BetSelectionsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BET_SELECTIONS}`));
  }

  get header() {
    return this.element.$(`~${HEADER}`);
  }

  get content() {
    return this.element.$(`~${CONTENT}`);
  }

  get selections() {
    return this.element.$$(`~${SELECTION}`);
  }
}

module.exports = BetSelectionsSO;
