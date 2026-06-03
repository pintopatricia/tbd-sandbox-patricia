const {
  RACE_LINK,
  RACE_LINK_ICON,
  RACE_LINK_SUBTITLE,
  RACE_LINK_TIME,
  RACE_LINK_TEXT_WRAPPER,
} = require("@ppb/tbd-shared/components/RaceByTimeRangeCard/snowflakes/RaceLink/RaceLink.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RaceLinkSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACE_LINK}`));
  }

  get textWrapper() {
    return this.element.$(RACE_LINK_TEXT_WRAPPER);
  }

  get raceTitle() {
    return this.element.$(`~${RACE_LINK_TIME}`);
  }

  get icons() {
    return this.element.$$(`~${RACE_LINK_ICON}`);
  }

  get subtitle() {
    return this.element.$(`~${RACE_LINK_SUBTITLE}`);
  }
}

module.exports = RaceLinkSO;
