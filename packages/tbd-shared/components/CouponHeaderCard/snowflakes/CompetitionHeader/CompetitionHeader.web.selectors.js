const styles = require("./CompetitionHeader.web.modules.json");

const TEST_ID = styles.competitionHeader;

module.exports = {
  TEST_ID,
  TITLE: `${styles.title}`,
  TITLE_LINK: `${styles.titleLink}`,
  COLUMNS: `${styles.columns} div${styles.column}`,
  STATS_COLUMN: `${styles.columnStats}`,
};
