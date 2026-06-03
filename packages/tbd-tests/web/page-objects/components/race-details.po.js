const {
  FLAG,
  RACE_TIME,
  MEETING_NAME,
  PRIMARY_SUBTITLE,
  RACE_LABEL,
  DISTANCE,
  PRIMARY_LABEL,
  SECONDARY_LABEL,
  TEST_ID,
  RACE_TYPE,
  RACE_INFO,
} = require("@ppb/the-wall-web/components/bricks/RaceDetails/RaceDetails.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RaceDetailsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get flag() {
    return this.element.$(FLAG);
  }

  get raceTime() {
    return this.element.$(RACE_TIME);
  }

  get meetingName() {
    return this.element.$(MEETING_NAME);
  }

  get primarySubtitle() {
    return this.element.$(PRIMARY_SUBTITLE);
  }

  get raceName() {
    return this.element.$(RACE_LABEL);
  }

  get raceType() {
    return this.element.$(RACE_TYPE);
  }

  get distance() {
    return this.element.$(DISTANCE);
  }

  get primaryLabel() {
    return this.element.$(PRIMARY_LABEL);
  }

  get secondarySubtitle() {
    return this.element.$(SECONDARY_LABEL);
  }

  get raceInfo() {
    return this.element.$(RACE_INFO);
  }
};
