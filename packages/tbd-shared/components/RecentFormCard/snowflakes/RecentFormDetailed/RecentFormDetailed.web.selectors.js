const { TEST_ID: TEST_ID_RESULT } = require("../RecentFormResult/RecentFormResult.web.selectors");
const styles = require("./RecentFormDetailed.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  RESULT: `${TEST_ID_RESULT}`,
  HOME_TEAM_RESULTS: `${styles.homeContainer}`,
  AWAY_TEAM_RESULTS: `${styles.awayContainer}`,
};
