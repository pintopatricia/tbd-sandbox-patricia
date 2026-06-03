const styles = require("./TimeformCard.web.modules.json");

const TEST_ID = styles.timeformCard;

module.exports = {
  TEST_ID,
  CONTENT: `${styles.content}`,
  RUNNER: styles.runnerRating,
  VERDICT_SECTION: `${TEST_ID}  ${styles.verdictSection}`,
  VERDICT_LABEL: `${TEST_ID}  ${styles.verdictLabel}`,
  VERDICT: `${TEST_ID}  ${styles.verdict}`,
};
