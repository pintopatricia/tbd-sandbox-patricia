const styles = require("./SubstitutionNotification.web.modules.json");

const TEST_ID = styles.card;

module.exports = {
  TEST_ID,
  TITLE: `${styles.sideTitle}`,
  PLAYER_IN: `${TEST_ID} span:nth-child(2)`,
  PLAYER_OUT: `${TEST_ID} span:nth-child(3)`,
  SVG_PLAYER_IN: `${TEST_ID} span:nth-child(2) > svg`,
  SVG_PLAYER_OUT: `${TEST_ID} span:nth-child(3) > svg`,
};
