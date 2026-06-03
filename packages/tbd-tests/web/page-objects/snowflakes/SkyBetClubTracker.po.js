const {
  TEST_ID,
  TRACKING_COUNTER_ICON,
  SUPPORTING_TEXT,
  LOGO_TEXT_CONTAINER,
  LOGO_TEXT_SECOND_LINE_CONTAINER,
} = require("@ppb/tbd-shared/components/SkyBetClubTrackerCard/view/snowflakes/SkyBetClubTracker/SkyBetClubTracker.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SkyBetClubProgressTrackerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get logoTextContainer() {
    return this.element.$(LOGO_TEXT_CONTAINER);
  }

  get logoTextSecondLineContainer() {
    return this.element.$(LOGO_TEXT_SECOND_LINE_CONTAINER);
  }

  get trackingCounterIcon() {
    return this.element.$(TRACKING_COUNTER_ICON);
  }

  get supportingText() {
    return this.element.$(SUPPORTING_TEXT);
  }
}

module.exports = SkyBetClubProgressTrackerPO;
