const { TITLE } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const styles = require("./FutureRacingCardGroup.web.modules.json");
const stylesFilteredCouponCardGroup = require("../FilteredCouponCardGroup.web.modules.json");

const TEST_ID = stylesFilteredCouponCardGroup.container;
const {
  TEST_ID: QUICK_LINKS_TEST_ID,
  QUICKLINK: QUICKLINKS_LIST,
} = require("../../QuickLinksCard/QuickLinksCard.web.selectors");

module.exports = {
  TEST_ID,
  TITLES: `${styles.title}`,
  QUICK_LINKS: `${QUICK_LINKS_TEST_ID}`,
  COLLAPSE_TITLES: `${TITLE}`,
  QUICKLINKS_LIST,
};
