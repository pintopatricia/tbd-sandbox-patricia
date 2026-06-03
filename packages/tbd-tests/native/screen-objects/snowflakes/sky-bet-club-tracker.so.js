const {
  SKY_BET_CLUB_TRACKER,
  TRACKING_COUNTER_ICON,
  SUPPORTING_TEXT,
  LOGO_TEXT_CONTAINER,
  LOGO_TEXT_SECOND_LINE_CONTAINER,
} = require("@ppb/tbd-shared/components/SkyBetClubTrackerCard/view/snowflakes/SkyBetClubTracker/SkyBetClubTracker.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SkyBetClubTrackerSo extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SKY_BET_CLUB_TRACKER}`));
  }

  get logoTextContainer() {
    return this.element.$(`~${LOGO_TEXT_CONTAINER}`);
  }

  get logoTextSecondLineContainer() {
    return this.element.$(`~${LOGO_TEXT_SECOND_LINE_CONTAINER}`);
  }

  get trackingCounterIcon() {
    return this.element.$(`~${TRACKING_COUNTER_ICON}`);
  }

  get supportingText() {
    return this.element.$(`~${SUPPORTING_TEXT}`);
  }
}

module.exports = SkyBetClubTrackerSo;
