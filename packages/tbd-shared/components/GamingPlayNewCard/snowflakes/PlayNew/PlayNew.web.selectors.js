const stylesTimer = require("../../../TimerCountDown/snowflakes/Timer/Timer.web.modules.json");
const stylesTimeUnit = require("../../../TimerCountDown/snowflakes/TimeUnit/TimeUnit.web.modules.json");

const styles = require("./PlayNew.web.modules.json");

module.exports = {
  TEST_ID: styles.container,
  PN_CONTAINER: styles.contentContainer,
  PN_LEFT_CONTENT: styles.leftContentWidget,
  PN_TITLE: styles.title,
  PN_SUBTITLE: styles.subtitle,
  PN_COUNTDOWN_TIMER: styles.countDownTimer,
  PN_TIMER_CONTAINER: `${styles.timerContainer}`,
  PN_TIMER: stylesTimer.countDownTimer,
  PN_TIMER_UNIT_VALUES: `${stylesTimeUnit.timerLabel}`,
  PN_TIMER_UNIT_TEXT: `${stylesTimeUnit.text}`,
  PN_BUTTON: `${styles.button}`,
  PN_RIGHT_CONTENT: `${styles.rightContentWidget}`,
  PN_STATIC_LOGO_IMAGE: `${styles.staticLogoImage}`,
  PN_BACKGROUND_IMAGE_CONTAINER: `${styles.backgroundImageContainer}`,
  PN_MORE_INFO_CONTAINER: `${styles.moreInfoContainer}`,
  PN_MORE_INFO_LINK: `${styles.moreInfoLink}`,
  PN_BADGE: `${styles.gameBadgeContainer}`,
};
