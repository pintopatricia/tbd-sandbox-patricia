const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { TEST_ID: NOTIFICATION } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const stylesPromoMessage = require("./snowflakes/PromoMessageCard/PromoMessageCard.web.modules.json");
const styles = require("./ImsPromotionErrorCard.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  NOTIFICATION: `${NOTIFICATION}`,
  TEXT: `${stylesPromoMessage.infoText}`,
  BUTTON: `${PRIMARY_BUTTON}`,
};
