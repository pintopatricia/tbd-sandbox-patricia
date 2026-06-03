const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const styles = require("./ClaimNowPromo.web.modules.json");

module.exports = {
  TEST_ID: styles.promoCard,
  TITLE: `h5`,
  AVAILABLE_FUNDS: `p:nth-of-type(2)`,
  SUB_HEADER: styles.subheader,
  BUTTON: `${PRIMARY_BUTTON}`,
};
