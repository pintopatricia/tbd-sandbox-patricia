const {
  TEST_ID,
  RACETITLE,
  ICON,
  SUBTITLE,
} = require("@ppb/tbd-shared/components/RaceByTimeRangeCard/snowflakes/RaceLink/RaceLink.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class RaceLinkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get raceText() {
    return this.element.$(RACETITLE);
  }

  get subtitle() {
    return this.element.$(SUBTITLE);
  }

  get icons() {
    return this.element.$$(ICON);
  }
}

module.exports = RaceLinkPO;
