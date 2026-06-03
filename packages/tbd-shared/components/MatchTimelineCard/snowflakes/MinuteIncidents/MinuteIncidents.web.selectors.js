const styles = require("./MinuteIncidents.web.modules.json");

module.exports = {
  TEST_ID: styles.footballTimelineMinute,
  MINUTE_LINE: styles.minuteLine,
  SIDES: styles.sides,
  MIDDLE: `${styles.middle}:not(${styles.hiddenMiddle})`,
  MINUTE: styles.minute,
  EXTRA_TIME: styles.extraTime,
};
