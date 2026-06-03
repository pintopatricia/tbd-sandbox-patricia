const styles = require("./GameTile.web.modules.json");
const stylesCustomLogo = require("./CustomLogo/CustomLogo.web.modules.json");

const TILE_GRADIENT = `${styles.tileGradient}`;

module.exports = {
  TEST_ID: styles.gameTile,
  TILE_GRADIENT,
  BACKGROUND: `${TILE_GRADIENT} ${styles.singleImage}`,
  LOGO: `${TILE_GRADIENT} ${styles.customLogoContainer}`,
  TITLE: styles.gameTitle,
  COPYRIGHT: styles.gameCopyright,
  JACKPOT_LOGO: `${styles.jackpotLogoContainer} img`,
  CUSTOM_LOGO: stylesCustomLogo.customLogo,
  INFO_BUTTON: styles.gameInfoContainer,
  JACKPOT_VALUE_CONTAINER: styles.label,
  ROUND: styles.round,
  FAVOURITE_BUTTON: `${styles.gameTextButtonContainer} > button${styles.gameInfoContainer}`,
  GAME_WIDGET_TILE: styles.gameWidgetTile,
};
