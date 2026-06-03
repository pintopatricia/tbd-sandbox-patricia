const { TEST_ID: SEE_ALL_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");
const stylesCardGroup = require("@ppb/the-wall-web/components/bricks/CardGroup/CardGroup.modules.json");
const styles = require("./GamesCardGroup.web.modules.json");

module.exports = {
  TEST_ID: stylesCardGroup.container,
  TITLE: stylesCardGroup.title,
  GAMES_GRID: styles.gamesGrid,
  CATEGORY_LINK: styles.linkContainer,
  SEE_ALL_LINK,
  GAME_CONTAINER: styles.gameContainer,
};
