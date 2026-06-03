const {
  TIMELINE_WRAPPER,
  INCIDENTS_WRAPPER,
  MINUTE_BY_MINUTE,
  TITLE_MINUTE,
  TEST_ID,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MatchTimelineDetails/MatchTimelineDetails.web.selectors");
const {
  TEST_ID: PERIOD_STATUS,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/PeriodStatusNotification/PeriodStatusNotification.web.selectors");
const { TEST_ID: MATCH_STATS } = require("@ppb/the-wall-web/components/rooms/MatchStats/MatchStats.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MatchTimelineDetailsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the timeline bar component
   * @return {HTMLElement} Timeline Bar component
   */
  get timelineWrapper() {
    return this.element.$(TIMELINE_WRAPPER);
  }

  /**
   * Gets the timeline details component
   * @return {HTMLElement} Timeline details component
   */
  get incidentsWrapper() {
    return this.element.$(INCIDENTS_WRAPPER);
  }

  /**
   * Gets the minute by minute components list
   * @return {HTMLElement} MinuteByMinute array
   */
  get listMinuteByMinute() {
    return this.element.$$(MINUTE_BY_MINUTE);
  }

  /**
   * Gets the Minute By Minute component title
   * @return {HTMLElement} Minute By Minute component title
   */
  get minuteByMinuteTitle() {
    return this.element.$(TITLE_MINUTE);
  }

  /**
   * Gets the period status notification components
   * @return {HTMLElement} Period Status Notification array
   */
  get periodStatusNotifications() {
    return this.element.$$(PERIOD_STATUS);
  }

  /**
   * Gets the match stats components
   * @return {HTMLElement} MatchStats array
   */
  get matchStatsNotifications() {
    return this.element.$$(MATCH_STATS);
  }
};
