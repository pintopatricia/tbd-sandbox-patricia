const stylesActionButton = require("@ppb/the-wall-web/components/bricks/ActionButton/ActionButton.modules.json");
const { CAROUSEL_ITEMS } = require("./components/GameInfoCarousel/GameInfoCarousel.selectors");
const pillStyles = require("./components/Pill/Pill.web.modules.json");
const tableRowStyles = require("./components/TableRow/TableRow.web.modules.json");
const styles = require("./GameInfo.web.modules.json");

module.exports = {
  TEST_ID: styles.gameInfoContainer,
  TITLE: styles.title,
  CAROUSEL_ITEMS,
  KEY_INFO: `${styles.keyInfoSection}`,
  KEY_INFO_PILLS: `${styles.keyInfoSection} ${pillStyles.pillWrapper}`,
  TABLE: `${styles.table}`,
  TABLE_CONTENT: `${styles.table} > :last-child ${tableRowStyles.rowValue}`,
  GAME_HELP: `${styles.table}  ${styles.tableContent} > :last-child a`,
  HOW_TO_PLAY_HEADLINE: `${styles.howToPlayDetails} ${styles.infoHeadlineTitle}`,
  PLAY_NOW_BUTTON_CONTAINER: styles.buttonContainer,
  PLAY_NOW_BUTTON: `${styles.buttonContainer} > :last-child ${stylesActionButton.actionButton}`,
  PLAY_NOW_BUTTON_URL: `${styles.buttonContainer} a`,
  DEMO_BUTTON_CONTAINER: styles.buttonContainer,
  DEMO_BUTTON: `${styles.buttonContainer}${styles.buttonContainerFlex} > :first-child ${stylesActionButton.actionButton}`,
  DEMO_BUTTON_URL: `${styles.buttonContainer} a`,
  FAVOURITE_BUTTON: styles.favoriteButton,
};
