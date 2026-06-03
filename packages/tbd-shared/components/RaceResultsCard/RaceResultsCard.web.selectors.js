const styles = require("./RaceResultsCard.web.modules.json");
const stylesPlaceholder = require("./RaceResultsCardPlaceholder.web.modules.json");

const TEST_ID = styles.container;

module.exports = {
  TEST_ID,
  WINNING_TIME_AND_BSP_ADVANTAGE_LABEL: `${TEST_ID} > ${styles.winningAndBspTitle}`,
  WINNING_TIME_LABEL: `${styles.winningTimeLabel}`,
  BSP_ADVANTAGE_LABEL: `${styles.bspAdvantageLabel}`,
  WINNING_TIME: `${styles.winningTime}`,
  BSP_ADVANTAGE: `${styles.bspAdvantage}`,
  PLACEHOLDER: stylesPlaceholder.container,
};
