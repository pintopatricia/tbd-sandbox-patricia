const { TEST_ID: QUICKLINK_LINK } = require("@ppb/the-wall-web/components/walls/QuickLink/QuickLink.selectors");
const styles = require("./DefaultGamingBrowse.web.modules.json");

const TEST_ID = styles.defaultGamingContainer;

module.exports = {
  TEST_ID,
  SUBTITLE: `${styles.subtitle}`,
  QUICK_LINK_CONTAINER: `${styles.quickLinksContainer}`,
  QUICK_LINK: `${TEST_ID} ${QUICKLINK_LINK}`,
};
