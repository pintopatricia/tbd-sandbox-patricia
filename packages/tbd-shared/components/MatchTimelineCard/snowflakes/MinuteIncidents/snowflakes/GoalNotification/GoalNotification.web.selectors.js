const styles = require("./GoalNotification.web.modules.json");

const TEST_ID = styles.card;

module.exports = {
  TEST_ID,
  TITLE: `${TEST_ID} span:nth-child(2)`,
  DESCRIPTION: `${TEST_ID} span:nth-child(3)`,
  SECOND_DESCRIPTION: `${TEST_ID} span:nth-child(4)`,
  IMAGE: `${styles.goal} > svg `,
  HOME: styles.home,
  AWAY: styles.away,
  GOAL: styles.goal,
  OWN_GOAL: styles.ownGoal,
};
