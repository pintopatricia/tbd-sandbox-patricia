const { CONTENT: SWITCHER_CONTENT } = require("@ppb/the-wall-web/components/bricks/Selector/Selector.selectors");

const {
  TEST_ID: SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const {
  TEST_ID: CIRCLE_IMAGE,
} = require("@ppb/tbd-shared/components/CompetitionViewLinkCard/snowflakes/CircularImage/CircularImage.web.selectors");
const {
  TEST_ID: EVENT_MARKET_CARD,
  ROUTER_LINK: EVENT_LINKS,
} = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.web.selectors");

const {
  TITLE: QUICKLINK_TITLE,
  LINKS: QUICKLINK_LINKS,
} = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.selectors");

const {
  LINK: COMPETITION_VIEW_LINK_CARD_LINK,
} = require("@ppb/tbd-shared/components/CompetitionViewLinkCard/CompetitionViewLinkCard.web.selectors");
const {
  CARD_COUPON_HEADER,
} = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.selectors");
const styles = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");

const TEST_ID = `${styles.genericViewContainer}`;
const UPCOMING_MATCHES_TITLE = `${CARD_COUPON_HEADER} h4`;

module.exports = {
  TEST_ID,
  SWITCHER_CONTENT,
  EVENT_MARKET_CARD,
  EVENT_LINKS,
  UPCOMING_MATCHES_TITLE,
  SCROLLABLE_SWIMLANE,
  CIRCLE_IMAGE,
  QUICKLINK_TITLE,
  QUICKLINK_LINKS,
  COMPETITION_VIEW_LINK_CARD_LINK,
};
