const stylesGenericView = require("../GenericView/GenericView.web.modules.json");
const styles = require("./GamingCardGroup.web.modules.json");

module.exports = {
  TEST_ID: stylesGenericView.genericViewContainer,
  FAVOURITES_WELCOME: styles.favouritesWelcome,
  FAVOURITES_TITLE: styles.favouritesTitle,
  FAVOURITES_EMPTY_MESSAGE: styles.emptyStateMessage,
  FAVOURITES_EMPTY_INSTRUCTION: styles.emptyStateInstruction,
  FAVOURITES_HEART_ICON: styles.heartIcon,
  WIDGET_POSITION: styles.gameTileWidgetPositioning,
};
