const { TEST_ID: RESULT } = require("@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult.selectors");
const styles = require("./PeriodStatusNotification.web.modules.json");

const TEST_ID = styles.periodStatusNotificationContainer;

module.exports = {
  TEST_ID,
  TITLE: `${styles.title}`,
  RESULT: `${RESULT}`,
};
