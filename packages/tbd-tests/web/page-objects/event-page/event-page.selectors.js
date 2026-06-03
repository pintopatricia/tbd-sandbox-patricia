const { EXCHANGE_MARKET } = require("@ppb/the-wall-web/components/bricks/Card/Card.selectors");
const {
  TEST_ID: TEST_ID_SCROLLABLE_SWIMLANE,
} = require("@ppb/the-wall-web/components/walls/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { TEST_ID: TEST_ID_MARKET } = require("@ppb/tbd-shared/components/Market/Market.web.selectors");

const {
  TEST_ID: TEST_ID_HTS_CARD_GROUP,
} = require("@ppb/tbd-shared/components/HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.web.selectors");

const {
  TITLE: QUICKLINK_TITLE,
  LINKS: QUICKLINK_LINKS,
} = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.selectors");
const styles = require("@ppb/tbd-shared/components/GenericView/GenericView.web.modules.json");

const TEST_ID = `${styles.genericViewContainer}`;

const MARKET_CONTAINER = TEST_ID_MARKET;
const SCROLLABLE_SWIMLANE = TEST_ID_SCROLLABLE_SWIMLANE;
const CARD_GROUPS = `${styles.emptyMargins}`;
const HALF_TIME_SPECIALS_SWIMLANE_CARD_GROUP = TEST_ID_HTS_CARD_GROUP;

module.exports = {
  TEST_ID,
  EXCHANGE_MARKET,
  MARKET_CONTAINER,
  CARD_GROUPS,
  SCROLLABLE_SWIMLANE,
  QUICKLINK_TITLE,
  QUICKLINK_LINKS,
  HALF_TIME_SPECIALS_SWIMLANE_CARD_GROUP,
};
