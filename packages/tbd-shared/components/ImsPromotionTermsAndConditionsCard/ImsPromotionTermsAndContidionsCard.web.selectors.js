const { TEST_ID: TEXT } = require("@ppb/the-wall-web/components/walls/RichText/RichText.selectors");
const styles = require("./ImsPromotionTermsAndConditionsCard.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  TITLE: `${styles.title}`,
  TEXT: `${TEXT}`,
};
