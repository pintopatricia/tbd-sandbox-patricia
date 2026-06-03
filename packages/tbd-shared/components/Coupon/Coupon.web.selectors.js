const stylesTeam = require("@ppb/the-wall-web/components/bricks/Team/Team.modules.json");
const styles = require("./Coupon.web.modules.json");

const TEST_ID = styles.couponContainer;
const MARKET_NAME = `${styles.marketName}`;
const SCOREBOARD_TEAM_NAMES = `${TEST_ID} ${stylesTeam.team}`;
const SUPPORTING_CONTENT_BUTTON = `${TEST_ID} ${styles.statsButtonContainer}`;

module.exports = {
  TEST_ID,
  MARKET_NAME,
  SCOREBOARD_TEAM_NAMES,
  SUPPORTING_CONTENT_BUTTON,
};
