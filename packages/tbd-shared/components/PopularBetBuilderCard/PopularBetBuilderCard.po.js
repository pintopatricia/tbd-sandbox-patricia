const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  TEST_ID,
  SCOREBOARD_CONTAINER,
  BET_BUTTON_CONTAINER,
  SELECTIONS_CONTAINER,
} = require("./PopularBetBuilderCard.web.selectors");
const {
  SPORTSBOOK_BET_BUTTON: POPULAR_BET_BUILDER_BET_BUTTON,
} = require("../BettingOpportunityBetButton/BettingOpportunityBetButton.web.selectors");

module.exports = class PopularBetBuilderCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get scoreboardContainer() {
    return this.element.$(SCOREBOARD_CONTAINER);
  }

  get selectionsContainer() {
    return this.element.$(SELECTIONS_CONTAINER);
  }

  get betButtonContainer() {
    return this.element.$(BET_BUTTON_CONTAINER);
  }

  get popularBetBuilderBetButton() {
    return this.element.$(POPULAR_BET_BUILDER_BET_BUTTON);
  }
};
