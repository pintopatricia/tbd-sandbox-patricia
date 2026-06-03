const {
  TEST_ID,
  TITLE,
  RESULT,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/PeriodStatusNotification/PeriodStatusNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PeriodStatusNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get periodStatusTitle() {
    return this.element.$(TITLE);
  }

  get periodStatusResult() {
    return this.element.$(RESULT);
  }
};
