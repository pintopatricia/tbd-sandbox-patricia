const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.web.selectors");
const {
  NOTIFICATIONS_LIST,
} = require("@ppb/tbd-shared/components/Betslip/SportsbookPlace/SportsbookPlace.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SportsbookPlacePO extends BasePO {
  /**
   * Creates a sbk place panel page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get notificationsList() {
    return this.element.$(NOTIFICATIONS_LIST);
  }
}

module.exports = SportsbookPlacePO;
