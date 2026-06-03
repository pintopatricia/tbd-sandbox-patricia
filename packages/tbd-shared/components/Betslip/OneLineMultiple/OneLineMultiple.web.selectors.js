const { TEST_ID: NOTIFICATION_TEST_ID } = require("@ppb/the-wall-web/components/walls/Alerts/Alerts.selectors");
const { BET_TYPE } = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");

const styles = require("./OneLineMultiple.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  NOTIFICATION: `${NOTIFICATION_TEST_ID}`,
  TEXT: BET_TYPE,
};
