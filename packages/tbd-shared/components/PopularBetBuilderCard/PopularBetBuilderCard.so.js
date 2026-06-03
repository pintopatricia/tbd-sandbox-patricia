const { BasePO } = require("@ppb/wdio-lazy-element");
const { BUBBLE_ITEM } = require("./snowflakes/BubbleItem/BubbleItem.native.selectors");
const {
  TEST_ID: BETTING_OPPORTUNITY_BET_BUTTON,
} = require("../BettingOpportunityBetButton/BettingOpportunityBetButton.native.selectors");
const {
  POPULAR_BET_BUILDER,
  POPULAR_BET_BUILDER_FIXTURE_HEADER,
  SELECTIONS_CONTAINER,
} = require("./PopularBetBuilderCard.native.selectors");

class PopularBetBuilderCardSO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${POPULAR_BET_BUILDER}`));
  }

  get fixtureHeader() {
    return this.element.$(`~${POPULAR_BET_BUILDER_FIXTURE_HEADER}`);
  }

  get selectionsContainer() {
    return this.element.$(`~${SELECTIONS_CONTAINER}`);
  }

  get selections() {
    return this.element.$$(`~${BUBBLE_ITEM}`);
  }

  get betButtonContainer() {
    return this.element.$(`~${BETTING_OPPORTUNITY_BET_BUTTON}`);
  }
}

module.exports = PopularBetBuilderCardSO;
