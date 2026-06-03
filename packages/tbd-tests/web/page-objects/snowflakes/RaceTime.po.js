const {
  TEST_ID,
  RACE_CONTENT,
  ACTIVE_RACE_CONTENT,
  ICON_CONTAINER,
  RACE_TIME,
  MEETING_NAME,
  PROMO_ICON_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/RaceTime/RaceTime.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RaceSelector extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get raceContent() {
    return this.element.$(RACE_CONTENT);
  }

  get activeRaceContent() {
    return this.element.$(ACTIVE_RACE_CONTENT);
  }

  get iconContainer() {
    return this.element.$(ICON_CONTAINER);
  }

  get raceTime() {
    return this.element.$(RACE_TIME);
  }

  get meetingName() {
    return this.element.$(MEETING_NAME);
  }

  get promoIconContainer() {
    return this.element.$(PROMO_ICON_CONTAINER);
  }
};
