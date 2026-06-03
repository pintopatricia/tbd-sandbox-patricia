const { TITLE: PAGE_HEADER_TITLE } = require("@ppb/the-wall-web/components/bricks/PageHeader/PageHeader.selectors");
const {
  CARD_COUPON_HEADER,
} = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.selectors");
const styles = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");
const {
  TEST_ID: TEST_ID_SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");

const TEST_ID = `${styles.genericViewContainer}`;
const TITLE = `${styles.header} ${PAGE_HEADER_TITLE}`;
const SCROLLABLE_SWIMLANE = TEST_ID_SCROLLABLE_SWIMLANE;
const EVENT_MARKET_SWIMLANE_TITLE = `${CARD_COUPON_HEADER} h4`;
const CARD_GROUPS = `${styles.emptyMargins}`;
const PLACEHOLDERS = `${CARD_GROUPS} > ${styles.placeholder}`; // FIXME

module.exports = {
  TEST_ID,
  TITLE,
  EVENT_MARKET_SWIMLANE_TITLE,
  SCROLLABLE_SWIMLANE,
  PLACEHOLDERS,
};
