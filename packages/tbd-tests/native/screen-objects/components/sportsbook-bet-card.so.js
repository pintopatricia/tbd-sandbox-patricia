const {
  SUPER_SUB_ICON,
  SPORTSBOOK_BET_CARD,
} = require("@ppb/tbd-shared/components/SportsbookBetCard/SportsbookBetCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class SportsbookBetCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SPORTSBOOK_BET_CARD}`));
  }

  get superSubIconContainer() {
    return this.element.$(`~${SUPER_SUB_ICON}`);
  }
};
