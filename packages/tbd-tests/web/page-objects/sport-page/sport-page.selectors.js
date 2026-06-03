const styles = require("@ppb/tbd-shared/components/App/App.web.modules.json");
const stylesGenericView = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");
const stylesPebbleCardGroup = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.web.modules.json");
const stylesActionLink = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.modules.json");
const stylesContentSummary = require("@ppb/tbd-shared/components/ContentSummaryCard/ContentSummaryCard.web.modules.json");
const {
  TEST_ID: PRIMARY_EVENT_CARD_SELECTOR,
} = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.web.selectors");
const {
  CARD_COUPON_HEADER,
} = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.selectors");
const {
  TEST_ID: TEST_ID_SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");

const TEST_ID = `${styles.scrollable}`;
const PRIMARY_EVENT_CARD = `${PRIMARY_EVENT_CARD_SELECTOR}`;
const CARD_GROUPS = `${stylesGenericView.emptyMargins}`;
const SCROLLABLE_SWIMLANE = TEST_ID_SCROLLABLE_SWIMLANE;
const EVENT_MARKET_SWIMLANE_SECTION_HEADER = `${CARD_COUPON_HEADER}`;
const EVENT_MARKET_SWIMLANE_TITLE = `${EVENT_MARKET_SWIMLANE_SECTION_HEADER} h2`;
const ACTION_LINK = `${stylesActionLink.actionLink}`;
const CONTENT_SUMMARY_CARD = `${stylesGenericView.card} > div > ${stylesContentSummary.contentSummaryContainer}`; // FIXME
const PEBBLE_CARD_GROUP = `${stylesPebbleCardGroup.container}`;

module.exports = {
  TEST_ID,
  CARD_GROUPS,
  PRIMARY_EVENT_CARD,
  SCROLLABLE_SWIMLANE,
  EVENT_MARKET_SWIMLANE_TITLE,
  ACTION_LINK,
  CONTENT_SUMMARY_CARD,
  PEBBLE_CARD_GROUP,
};
