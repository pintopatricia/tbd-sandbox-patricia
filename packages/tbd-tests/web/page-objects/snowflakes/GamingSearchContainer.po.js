const {
  TEST_ID,
  DEFAULT_CONTAINER,
  SEARCH_RESULTS_CONTAINER,
  RECOMMENDED_GAMES_CONTAINER,
  NO_RESULTS_LABEL,
  OUT_OF_IDEAS_LABEL,
  NUMBER_OF_RESULTS_LABEL,
  GAMING_SEARCH_BAR,
  GAME_TILE,
  SEARCH_HISTORY,
} = require("@ppb/tbd-shared/components/GamingSearchZone/snowflakes/GamingSearchContainer/GamingSearchContainer.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GamingSearchContainerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get defaultContainer() {
    return this.element.$(DEFAULT_CONTAINER);
  }

  get searchResultsContainer() {
    return this.element.$(SEARCH_RESULTS_CONTAINER);
  }

  get recommendedGamesContainer() {
    return this.element.$(RECOMMENDED_GAMES_CONTAINER);
  }

  get outOfIdeasLabel() {
    return this.element.$(OUT_OF_IDEAS_LABEL);
  }

  get noResultsLabel() {
    return this.element.$(NO_RESULTS_LABEL);
  }

  get numberOfResults() {
    return this.element.$(NUMBER_OF_RESULTS_LABEL);
  }

  get results() {
    return this.element.$$(GAME_TILE);
  }

  get gamingSearchBar() {
    return this.element.$(GAMING_SEARCH_BAR);
  }

  get searchHistory() {
    return this.element.$(SEARCH_HISTORY);
  }
};
