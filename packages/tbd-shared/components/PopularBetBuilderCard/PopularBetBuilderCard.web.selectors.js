const styles = require("./PopularBetBuilderCard.web.modules.json");

const TEST_ID = styles.popularBetBuilderCard;

module.exports = {
  TEST_ID,
  HEADER: `${styles.header}`,
  SCOREBOARD_CONTAINER: `${styles.header} > a`,
  SELECTIONS_CONTAINER: `${styles.bubbleItemsContainer}`,
  BET_BUTTON_CONTAINER: `${styles.betButtonContainer}`,
};
