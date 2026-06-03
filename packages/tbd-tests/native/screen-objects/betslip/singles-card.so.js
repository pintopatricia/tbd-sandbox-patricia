const {
  SINGLES_CARD,
  SINGLES_CARD_ITEM,
} = require("@ppb/tbd-shared/components/Betslip/SinglesCard/SinglesCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SinglesCardSO extends BaseSO {
  /**
   * Creates a sportsbook single card page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${SINGLES_CARD}`));
  }

  get singles() {
    return this.element.$$(`~${SINGLES_CARD_ITEM}`);
  }
}

module.exports = SinglesCardSO;
