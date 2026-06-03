const styles = require("@ppb/tbd-shared/components/App/App.web.modules.json");
const stylesGenericView = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");
const stylesGamesCardGroup = require("@ppb/tbd-shared/components/GamesCardGroup/GamesCardGroup.web.modules.json");
const stylesCardGroup = require("@ppb/the-wall-web/components/bricks/CardGroup/CardGroup.modules.json");
const stylesBackNavigationItem = require("@ppb/tbd-shared/components/BackNavigationItem/BackNavigationItem.web.modules.json");

const TEST_ID = `${styles.scrollable}`;
const GAMING_PAGE_CONTAINER = `${TEST_ID} ${stylesGenericView.genericViewContainer}`;
const GAMING_CATEGORY_PAGE_CONTAINER = `${TEST_ID} ${stylesGenericView.genericViewContainer}`;
const TITLE = `${stylesCardGroup.title}`;
const GAMES_GRID = `${stylesGamesCardGroup.gamesGrid}`;
const GAME_CONTAINER = `${stylesGamesCardGroup.gameContainer}`;
const BACK_NAVIGATION_CONTAINER = `${stylesBackNavigationItem.container}`;

module.exports = {
  TEST_ID,
  TITLE,
  GAMING_PAGE_CONTAINER,
  GAMING_CATEGORY_PAGE_CONTAINER,
  GAMES_GRID,
  GAME_CONTAINER,
  BACK_NAVIGATION_CONTAINER,
};
