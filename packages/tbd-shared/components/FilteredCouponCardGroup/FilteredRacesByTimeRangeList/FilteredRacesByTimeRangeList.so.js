const { QUICK_LINK } = require("@ppb/the-wall-native/components/QuickLink/QuickLink.selectors");
const {
  SCROLLABLE_SWIMLANE_TITLE,
} = require("@ppb/the-wall-native/components/ScrollableSwimlane/ScrollableSwimlane.selectors");
const { RACE_LINK } = require("../../RaceByTimeRangeCard/snowflakes/RaceLink/RaceLink.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { FILTERED_SWIMLANE } = require("./FilteredRacesByTimeRangeList.native.selectors");

class FilteredSwimlane extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FILTERED_SWIMLANE}`));
  }

  get title() {
    return this.element.$(`~${SCROLLABLE_SWIMLANE_TITLE}`);
  }

  get quicklinks() {
    return this.element.$$(`~${QUICK_LINK}`);
  }

  get racelinks() {
    return this.element.$$(`~${RACE_LINK}`);
  }
}

module.exports = FilteredSwimlane;
