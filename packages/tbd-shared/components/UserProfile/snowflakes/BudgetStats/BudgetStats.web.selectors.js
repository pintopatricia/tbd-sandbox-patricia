const stylesProgresseBar = require("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar.modules.json");
const styles = require("./BudgetStats.web.modules.json");

module.exports = {
  TEST_ID: styles.container,
  SPEND_STATUS: styles.statusContent,
  SPEND_TEXT: styles.statusText,
  HOME_PROGRESS_BAR: stylesProgresseBar.defaultHomeColor,
  AWAY_PROGRESS_BAR: stylesProgresseBar.defaultAwayColor,
};
