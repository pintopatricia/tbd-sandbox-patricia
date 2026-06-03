const { ACTION_LINK } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");

const { MARKET_SWITCHER_BUTTON } = require("./snowflakes/MarketSwitcher/MarketSwitcher.native.selectors");

const FILTERED_COUPON_CARD_GROUP = "filtered-coupon-card-group";
const { TIME_RANGE_MEETING } = require("../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native.selectors");

module.exports = {
  FILTERED_COUPON_CARD_GROUP,
  FILTERED_COUPON_CARD_GROUP_HEADER: `${FILTERED_COUPON_CARD_GROUP}-header`,
  FILTERED_COUPON_CARD_GROUP_TITLE: `${FILTERED_COUPON_CARD_GROUP}-title`,
  FILTER_CONTAINER: `${FILTERED_COUPON_CARD_GROUP}-container`,
  NO_RESULTS_SECTION: `${FILTERED_COUPON_CARD_GROUP}-no-results-section`,
  NO_RESULTS_LABEL: `${FILTERED_COUPON_CARD_GROUP}-no-results-label`,
  NO_RESULTS_SUGGESTION: `${FILTERED_COUPON_CARD_GROUP}-no-results-suggestion`,
  NO_RESULTS_BUTTON: `${FILTERED_COUPON_CARD_GROUP}-no-results-button`,
  ALL_RESET_BUTTON: ACTION_LINK,
  MARKET_SWITCHER_CONTAINER: `${FILTERED_COUPON_CARD_GROUP}-market-switcher-container`,
  MARKET_SWITCHER_BUTTON,
  PEBBLE_LIST_CONTAINER: `${FILTERED_COUPON_CARD_GROUP}-pebbles-list-container`,
  BY_TIME_RANGE_MEETING_CARD_GROUPS: `${TIME_RANGE_MEETING}`,
};
