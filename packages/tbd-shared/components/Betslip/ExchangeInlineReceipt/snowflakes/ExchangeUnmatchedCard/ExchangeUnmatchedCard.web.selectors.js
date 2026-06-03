const { SECONDARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const { PRIMARY_BUTTON } = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { TEST_ID } = require("../PlacedBetCard/PlacedBetCard.web.selectors");

const styles = require("./ExchangeUnmatchedCard.web.modules.json");

module.exports = {
  TEST_ID,
  NOTIFICATIONS: `${styles.notifications}`,
  ACTIONS_CONTAINER: `${styles.actions}`,
  CANCEL: `${TEST_ID} ${SECONDARY_BUTTON}`,
  CONFIRM: `${TEST_ID} ${PRIMARY_BUTTON}`,
};
