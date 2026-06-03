const styles = require("./SecondaryEventCard.web.modules.json");

const TEST_ID = styles.secondaryEventCard;

module.exports = {
  TEST_ID,
  RUNNER_HOME: `${TEST_ID} > span:first-child`,
  RUNNER_AWAY: `${TEST_ID} > ${styles.runnerNameAway}`,
  DATE: `${TEST_ID} > ${styles.startTimeContainer} > :first-child:not(${styles.inplay})`,
  INPLAY_LABEL: `${TEST_ID} > ${styles.startTimeContainer} > ${styles.inplay}`,
  START_TIME: `${TEST_ID} > ${styles.startTimeContainer} > :nth-child(2)`,
};
