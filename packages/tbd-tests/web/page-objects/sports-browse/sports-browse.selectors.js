const styles = require("@ppb/tbd-shared/components/SportsBrowse/SportsBrowse.web.modules.json");

const TEST_ID = styles.container;

const {
  LINKS: QUICKLINK_LINKS,
  TEST_ID: QUICKLINKS,
  QUICKLINK,
} = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.selectors");

module.exports = {
  TEST_ID,
  QUICKLINKS: `${QUICKLINKS}`,
  QUICKLINK_LINKS: `${QUICKLINK_LINKS}`,
  QUICKLINK: `${QUICKLINKS} ${QUICKLINK}`,
};
