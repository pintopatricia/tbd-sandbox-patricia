const { TEST_ID: SELECTION_TEST_ID } = require("@ppb/the-wall-web/components/walls/BetDetails/BetDetails.selectors");
const {
  TEST_ID: PLACE_FOOTER_ID,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/PlaceFooter/PlaceFooter.web.selectors");
const { TEST_ID: NOTIFICATION_TEST_ID } = require("@ppb/the-wall-web/components/bricks/Alert/Alert.selectors");
const { TEST_ID } = require("@ppb/tbd-shared/components/Betslip/ObbPlace/ObbPlace.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ObbPlacePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get selections() {
    return this.element.$$(SELECTION_TEST_ID);
  }

  get notification() {
    return this.element.$(NOTIFICATION_TEST_ID);
  }

  get notifications() {
    return this.element.$$(NOTIFICATION_TEST_ID);
  }

  get placeFooter() {
    return this.element.$(PLACE_FOOTER_ID);
  }
}

module.exports = ObbPlacePO;
