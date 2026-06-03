const {
  TEST_ID,
  PREMATCH,
  TIMELINES,
  TIMELINE_BARS,
  TIMELINE_CONTAINER,
  TEAM_CRESTS,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MatchTimeline/MatchTimeline.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MatchTimelinePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the prematch component
   * @return {HTMLElement} prematch component
   */
  get prematch() {
    return this.element.$(PREMATCH);
  }

  /**
   * Gets the timeline containers
   * @return {HTMLElement} a list of timelines
   */
  get timelines() {
    return this.element.$$(TIMELINES);
  }

  /**
   * Gets the timeline bars
   * @return {HTMLElement} a list of timeline bars
   */
  get timelineBars() {
    return this.element.$$(TIMELINE_BARS);
  }

  /**
   * Gets the timeline container
   * @return {HTMLElement} timeline container
   */
  get timelineContainer() {
    return this.element.$(TIMELINE_CONTAINER);
  }

  /**
   * Gets the team crests
   * @return {HTMLElement} team crests
   */
  get teamCrests() {
    return this.element.$(TEAM_CRESTS);
  }
};
