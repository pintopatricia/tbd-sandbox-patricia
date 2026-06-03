const {
  FREE_BETS_CARD_LABEL,
} = require("@ppb/the-wall-native/components/FreeBetsCardLabel/FreeBetsCardLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FreeBetsCardLabelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FREE_BETS_CARD_LABEL}`));
  }

  get label() {
    return this.element.$(`~${FREE_BETS_CARD_LABEL}`);
  }
}

module.exports = FreeBetsCardLabelSO;
