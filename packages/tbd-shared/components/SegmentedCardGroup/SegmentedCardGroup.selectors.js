const {
  TEST_ID: SCROLLABLE_SWIMLANE_TEST_ID,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.modules.json");
const stylesCardGroup = require("@ppb/the-wall-web/components/bricks/CardGroup/CardGroup.modules.json");
const styles = require("./SegmentedCardGroup.web.modules.json");

const { TEST_ID: GAMES_CARD_GROUP_CONTAINER } = require("../GamesCardGroup/GamesCardGroup.web.selectors");
const stylesGamesCardGroup = require("../GamesCardGroup/GamesCardGroup.web.modules.json");

module.exports = {
  TEST_ID: styles.segmentedCardGroupContainer,
  SWIMLANE: SCROLLABLE_SWIMLANE_TEST_ID,
  GAMING_ZONE: GAMES_CARD_GROUP_CONTAINER,
  SEGMENTED_TITLE: `${GAMES_CARD_GROUP_CONTAINER} ${stylesCardGroup.title}`,
  SEGMENTED_GAME_WRAPPER: stylesGamesCardGroup.segmentedGamesWrapper,
  SEGMENTED_GAME_TILE: stylesGamesCardGroup.segmentedGamesContainer,
};
