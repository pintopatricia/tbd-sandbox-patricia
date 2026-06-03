const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { COMPETITION_REGION_CARD_CONTAINER } = require("./CompetitionRegionCard.native.selectors");

class CompetitionRegionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${COMPETITION_REGION_CARD_CONTAINER}`));
  }

  get collapsibleCards() {
    return this.element.$$(`~${CARD}`);
  }
}

module.exports = CompetitionRegionCardSO;
