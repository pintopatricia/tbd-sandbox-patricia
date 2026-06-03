const styles = require("./TimelineBar.web.modules.json");

const TEST_ID = styles.timelineBar;

module.exports = {
  TEST_ID,
  INPLAY_BAR: `${styles.inplay}`,
  HOME_INCIDENTS_CONTAINER: `${styles.incidents}:first-child`,
  AWAY_INCIDENTS_CONTAINER: `${styles.incidents}:last-child`,
  INCIDENTS_LIST: `${styles.incident}`,
  CAPTION: `${styles.caption}`,
};
