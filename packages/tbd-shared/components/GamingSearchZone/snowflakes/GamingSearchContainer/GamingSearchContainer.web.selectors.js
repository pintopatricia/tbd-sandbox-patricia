const { TEST_ID: SEARCH_BAR_TEST_ID } = require("@ppb/the-wall-web/components/walls/SearchBar/SearchBar.selectors");
const styles = require("./GamingSearchContainer.web.modules.json");

const { TEST_ID: TEST_ID_GAMETILE } = require("../../../GameCard/snowflakes/GameTile/GameTile.web.selectors");

module.exports = {
  TEST_ID: styles.container,
  DEFAULT_CONTAINER: styles.defaultContainer,
  SEARCH_RESULTS_CONTAINER: styles.searchResultsContainer,
  RECOMMENDED_GAMES_CONTAINER: styles.recommendedGamesContainer,
  NO_RESULTS_LABEL: styles.noResultsLabel,
  NUMBER_OF_RESULTS_LABEL: styles.numberOfResultsLabel,
  OUT_OF_IDEAS_LABEL: styles.outOfIdeasLabel,
  GAMING_SEARCH_BAR: SEARCH_BAR_TEST_ID,
  GAME_TILE: TEST_ID_GAMETILE,
  SEARCH_HISTORY: styles.searchHistoryContainer,
};
