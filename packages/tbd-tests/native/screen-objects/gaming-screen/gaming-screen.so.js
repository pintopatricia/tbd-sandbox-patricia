const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  GAMING_SEARCH_CONTAINER,
  SEARCH_BAR_CONTAINER,
  SEARCH_RESULTS_CONTAINER,
  RECOMMENDED_GAMES_CONTAINER,
  NO_RESULTS_TEXT,
  NUMBER_OF_RESULTS_TEXT,
  OUT_OF_IDEAS_TEXT,
} = require("@ppb/tbd-shared/components/GamingSearchZone/snowflakes/GamingSearchContainer/GamingSearchContainer.native.selectors");

const {
  GAMING_SCREEN,
  GAMING_LOBBY,
  GAMING_LOBBY_VIEW,
  GAMING_ONBOARDING_VIEW,
  GAMING_MY_SELECTIONS_VIEW,
  GAMING_GAMES_COLLECTION_VIEW,
  GAMING_CUSTOMISE_BUTTON,
  GAMING_MANAGE_COLLECTION_BUTTON,
  GAMING_MY_SELECTIONS_TAG_CELL,
  GAMING_SAVE_AND_CLOSE_BUTTON,
  GAMING_SWIM_LANE_TILE_CELL,
  GAMING_ONBOARDING_FIRST_BUTTON,
  GAMING_ONBOARDING_SECOND_BUTTON,
} = require("./gaming-screen.selectors");

class GamingScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAMING_SCREEN}`));
  }

  get lobby() {
    return this.element.$(`~${GAMING_LOBBY}`);
  }

  get onBoardingView() {
    return $(`~${GAMING_ONBOARDING_VIEW}`);
  }

  get lobbyView() {
    return this.element.$(`~${GAMING_LOBBY_VIEW}`);
  }

  get mySelectionsView() {
    return this.element.$(`~${GAMING_MY_SELECTIONS_VIEW}`);
  }

  get gamesCollectionView() {
    return this.element.$(`~${GAMING_GAMES_COLLECTION_VIEW}`);
  }

  get customiseButton() {
    return this.element.$(`~${GAMING_CUSTOMISE_BUTTON}`);
  }

  get manageCollectionButton() {
    return this.element.$(`~${GAMING_MANAGE_COLLECTION_BUTTON}`);
  }

  get mySelectionTag() {
    return this.element.$(`~${GAMING_MY_SELECTIONS_TAG_CELL}`);
  }

  get saveAndCloseButton() {
    return this.element.$(`~${GAMING_SAVE_AND_CLOSE_BUTTON}`);
  }

  get swimLaneTileCells() {
    return this.element.$$(`~${GAMING_SWIM_LANE_TILE_CELL}`);
  }

  // Select OnBoarding first button (Save and Close)
  get onBoardingFirstButton() {
    return this.onBoardingView.$(`~${GAMING_ONBOARDING_FIRST_BUTTON}`);
  }

  // Select OnBoarding second button (Skip)
  get onBoardingSecondButton() {
    return this.onBoardingView.$(`~${GAMING_ONBOARDING_SECOND_BUTTON}`);
  }

  get gamingSearchContainer() {
    return this.element.$$(`~${GAMING_SEARCH_CONTAINER}`);
  }

  get gamingSearchBarContainer() {
    return this.element.$$(`~${SEARCH_BAR_CONTAINER}`);
  }

  get gamingSearchResultsContainer() {
    return this.element.$$(`~${SEARCH_RESULTS_CONTAINER}`);
  }

  get gamingSearchRecommendedGamesContainer() {
    return this.element.$$(`~${RECOMMENDED_GAMES_CONTAINER}`);
  }

  get gamingSearchNoResultsText() {
    return this.element.$$(`~${NO_RESULTS_TEXT}`);
  }

  get gamingSearchNumberOfResultsText() {
    return this.element.$$(`~${NUMBER_OF_RESULTS_TEXT}`);
  }

  get gamingSearchOutOfIdeasText() {
    return this.element.$$(`~${OUT_OF_IDEAS_TEXT}`);
  }
}

module.exports = GamingScreenSO;
