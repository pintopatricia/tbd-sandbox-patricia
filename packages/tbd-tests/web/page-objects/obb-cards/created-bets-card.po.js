const {
  CARD,
  HEADER,
  FOOTER,
  SEE_ALL_CONTAINER,
  OUTCOMES_CONTAINER,
  MATCH_STAT_SELECTION_TITLE,
  MATCH_STAT_SELECTION_SUBTITLE,
  CONTEXTUAL_STATS,
} = require("@ppb/tbd-shared/components/ObbCreatedBetsCard/ObbCreatedBetsCard.web.selectors");

const {
  TEST_ID: BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class CreatedBetsCardPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(CARD));
  }

  get card() {
    return this.element.$(CARD);
  }

  get header() {
    return this.element.$(HEADER);
  }

  get footer() {
    return this.element.$(FOOTER);
  }

  get seeAllContainer() {
    return this.element.$(SEE_ALL_CONTAINER);
  }

  get seeAllButton() {
    return this.seeAllContainer.$("button");
  }

  get outcomesContainer() {
    return this.element.$(OUTCOMES_CONTAINER);
  }

  get betButtons() {
    return this.element.$$(BET_BUTTON);
  }

  get matchStatTitle() {
    return this.element.$$(MATCH_STAT_SELECTION_TITLE);
  }

  get matchStatSubtitle() {
    return this.element.$$(MATCH_STAT_SELECTION_SUBTITLE);
  }

  get contextualStats() {
    return this.element.$$(CONTEXTUAL_STATS);
  }
};
