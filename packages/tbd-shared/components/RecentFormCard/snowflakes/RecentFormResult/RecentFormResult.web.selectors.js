const stylesRecentFormIcon = require("@ppb/the-wall-web/components/bricks/RecentFormIcon/RecentFormIcon.modules.json");
const styles = require("./RecentFormResult.web.modules.json");

const TEST_ID = styles.container;
module.exports = {
  TEST_ID,
  FORM_CONTAINER: TEST_ID,
  FORM_SCORE: styles.recentFormScore,
  FORM_PENALTIES_SCORE: styles.recentFormScorePenalties,
  FORM_OPPONENT_NAME: styles.recentFormOpponent,
  FORM_DATE: styles.recentFormDate,
  FORM_COMPETITION: styles.recentFormCompetition,
  ICON: stylesRecentFormIcon.formIcon,
  AET: styles.extraTime,
  PEN: styles.penalties,
};
