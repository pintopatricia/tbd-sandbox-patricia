const styles = require("./PlayerView.web.modules.json");

const PLAYER_VIEW_CONTAINER = styles.container;

module.exports = {
  PLAYER_VIEW_CONTAINER,
  PLAYER_VIEW_LOADING_LABEL: `${PLAYER_VIEW_CONTAINER} ${styles.loadingLabel}`,
  PLAYER_VIEW_HEADER: `${PLAYER_VIEW_CONTAINER} ${styles.header}`,
  PLAYER_VIEW_HEADER_NAME: `${PLAYER_VIEW_CONTAINER} ${styles.header} ${styles.playerInfo} ${styles.playerName}`,
  PLAYER_VIEW_HEADER_POSITION: `${PLAYER_VIEW_CONTAINER} ${styles.header} ${styles.playerInfo} ${styles.playerPosition}`,
  PLAYER_VIEW_HEADER_SHIRT_NUMBER: `${PLAYER_VIEW_CONTAINER} ${styles.header} ${styles.playerShirtNumber}`,
};
