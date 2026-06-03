const { TEST_ID } = require("@ppb/the-wall-web/components/walls/SelectableItems/SelectableItems.selectors");
const {
  TEST_ID: RACE_TIME,
  ACTIVE_RACE_CONTENT,
} = require("@ppb/the-wall-web/components/bricks/RaceTime/RaceTime.selectors");
const {
  TEST_ID: STATISTIC_ITEM,
  ACTIVE_CONTENT,
} = require("@ppb/the-wall-web/components/bricks/IconButton/IconButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SelectableItems extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get races() {
    return this.element.$$(RACE_TIME);
  }

  get statistics() {
    return this.element.$$(STATISTIC_ITEM);
  }

  get activeRaceContent() {
    return this.element.$(ACTIVE_RACE_CONTENT);
  }

  get activeStatisticContent() {
    return this.element.$(ACTIVE_CONTENT);
  }
};
