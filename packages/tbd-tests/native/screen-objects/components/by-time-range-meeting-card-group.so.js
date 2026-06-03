const {
  TIME_RANGE_MEETING,
} = require("@ppb/tbd-shared/components/ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native.selectors");
const {
  RACE_LINK,
} = require("@ppb/tbd-shared/components/RaceByTimeRangeCard/snowflakes/RaceLink/RaceLink.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class ByTimeRangeMeetingCardGroup extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIME_RANGE_MEETING}`));
  }

  get racelinks() {
    return this.element.$$(`~${RACE_LINK}`);
  }
};
