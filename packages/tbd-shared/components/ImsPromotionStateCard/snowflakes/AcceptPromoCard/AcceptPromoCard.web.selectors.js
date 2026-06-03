const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const styles = require("./AcceptPromoCard.web.modules.json");

const TEST_ID = styles.acceptPromo;

module.exports = {
  TEST_ID,
  TITLE: `${styles.title}`,
  TANDC: `${styles.tcText}`,
  BUTTON: `${PRIMARY_BUTTON}`,
};
