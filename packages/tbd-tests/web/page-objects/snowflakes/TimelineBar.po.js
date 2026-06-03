const {
  TEST_ID,
  INPLAY_BAR,
  INCIDENTS_LIST,
  CAPTION,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/TimelineBar/TimelineBar.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TimelineBarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the inplay timeline bar
   * @return {HTMLElement} inplay timeline bar
   */
  get getTimelineBar() {
    return this.element.$(INPLAY_BAR);
  }

  /**
   * Gets a list of incidents
   * @return {HTMLElement} a list of incidents
   */
  get getIncidentsList() {
    return this.element.$$(INCIDENTS_LIST);
  }

  /**
   * Gets the caption element
   * @return {HTMLElement} caption element
   */
  get getCaption() {
    return this.element.$(CAPTION);
  }
};
