const {
  PROGRESS_BAR,
  TRACKING_COUNTER_CURRENT,
} = require("@ppb/the-wall-web/components/walls/TrackingBar/TrackingBar.selectors");
const styles = require("./SkyBetClubTracker.web.modules.json");

module.exports = {
  TEST_ID: styles.container,
  LOGO_TEXT_CONTAINER: styles.logoTextContainer,
  LOGO_TEXT_SECOND_LINE_CONTAINER: styles.logoTextSecondLineContainer,
  PROGRESS_BAR,
  TRACKING_COUNTER_CURRENT,
  TRACKING_COUNTER_ICON: styles.trackingCounterValueIconWrapper,
  SUPPORTING_TEXT: styles.supportingText,
};
