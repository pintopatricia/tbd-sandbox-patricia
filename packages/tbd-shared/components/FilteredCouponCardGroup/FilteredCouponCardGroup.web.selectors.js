const { TEST_ID: ACTION_LINK_TEST_ID } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");
const {
  TEST_ID: SWIMLANE_TEST_ID,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { TEST_ID: MARKET_SWITCHER_TEST_ID } = require("./snowflakes/MarketSwitcher/MarketSwitcher.web.selectors");
const { TEST_ID: QUICK_LINKS_TEST_ID } = require("../QuickLinksCard/QuickLinksCard.web.selectors");
const { EVENT_COUPONS } = require("../CouponList/CouponList.web.selectors");
const { TEST_ID: SINGLE_FILTER_DRAWER_TEST_ID } = require("./SingleFilterDrawer/SingleFilterDrawer.web.selectors");
const {
  TEST_ID: MULTIPLE_FILTER_DRAWER_TEST_ID,
} = require("./MultipleFilterDrawer/MultipleFilterDrawer.web.selectors");
const {
  TEST_ID: COMPETITION_FILTER_DRAWER_TEST_ID,
} = require("./CompetitionFilterDrawer/CompetitionFilterDrawer.web.selectors");
const {
  TEST_ID: BY_TIME_RANGE_MEETING_CARD_GROUPS_TEST_ID,
} = require("../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.web.selectors");
const styles = require("./FilteredCouponCardGroup.web.modules.json");

const TEST_ID = styles.container;
const NO_RESULTS = `${TEST_ID} ${styles.noResults}`;
const CARD_COUPON_HEADER = `${TEST_ID} ${styles.header}`;

module.exports = {
  TEST_ID,
  EVENT_COUPONS: `${EVENT_COUPONS}`,
  SWIMLANES: `${SWIMLANE_TEST_ID}`,
  QUICK_LINKS: `${QUICK_LINKS_TEST_ID}`,
  FILTER_CONTAINER: `${TEST_ID} ${styles.filter}`,
  CARD_COUPON_HEADER,
  TITLE: `${CARD_COUPON_HEADER} > ${styles.title}`,
  ACTION_LINK: `${CARD_COUPON_HEADER} > ${ACTION_LINK_TEST_ID}`,
  NO_RESULTS,
  NO_RESULTS_LABEL: `${NO_RESULTS} > ${styles.noResultsLabel}`,
  NO_RESULTS_SUGGESTION_LABEL: `${NO_RESULTS} > [class=typography-h152]`,
  NO_RESULTS_RESET: `${styles.noResultsReset} > ${ACTION_LINK_TEST_ID}`,
  SINGLE_FILTER_DRAWER: SINGLE_FILTER_DRAWER_TEST_ID,
  MULTIPLE_FILTER_DRAWER: MULTIPLE_FILTER_DRAWER_TEST_ID,
  COMPETITION_FILTER_DRAWER: COMPETITION_FILTER_DRAWER_TEST_ID,
  PLACEHOLDERS: `${styles.placeholder}`,
  MARKET_SWITCHER: MARKET_SWITCHER_TEST_ID,
  PEBBLE_LIST_CONTAINER: `${TEST_ID} ${styles.pebbleListContainer}`,
  BY_TIME_RANGE_MEETING_CARD_GROUPS: `${BY_TIME_RANGE_MEETING_CARD_GROUPS_TEST_ID}`,
};
