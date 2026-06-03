const styles = require("./RewardsStats.web.modules.json");

const TEST_ID = styles.rewardsBar;

module.exports = {
  TEST_ID,
  MONTH_REWARDS: `${TEST_ID} > ${styles.monthRewards}`,
};
