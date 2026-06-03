const {
  TEST_ID,
  SHOW_BUTTON,
  HEADER_LABELS,
  RACE_INFO_CELLS,
  RACE_INFO_ROW,
  RACE_INFO_COMMENT,
  RACE_INFO_RACE_REPLAY_ICON,
} = require("@ppb/the-wall-web/components/bricks/RecentRaces/RecentRaces.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RecentRacesPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get showButton() {
    return this.element.$(SHOW_BUTTON);
  }

  get headerLabels() {
    return this.element.$$(HEADER_LABELS);
  }

  get raceInfo() {
    return this.element.$$(RACE_INFO_CELLS);
  }

  get raceInfoRow() {
    return this.element.$$(RACE_INFO_ROW);
  }

  get raceInfoComment() {
    return this.element.$$(RACE_INFO_COMMENT);
  }

  get raceInfoRaceReplayIcon() {
    return this.element.$$(RACE_INFO_RACE_REPLAY_ICON);
  }
};
