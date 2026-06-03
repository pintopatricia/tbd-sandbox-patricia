const styles = require("./ObbPlayersRowCard.web.modules.json");

const TEST_ID = styles.playerCardContainer;

module.exports = {
  TEST_ID,
  PLAYER_NAME: `${styles.playerNameContainer}`,
  PLAYER_SELECTED: `${styles.highlighted}`,
  DISABLED_FIRST_NAME: `${styles.firstName}${styles.labelDisabled}`,
  FIRST_NAME: `${styles.firstName}`,
  LAST_NAME: `${styles.lastName}`,
  PLAYER_POSITION_AND_NUMBER: `${styles.playerPositionAndNumber}`,
  JERSEY: `${styles.jersey}`,
};
