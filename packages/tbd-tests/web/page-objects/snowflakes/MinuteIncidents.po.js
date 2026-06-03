const {
  TEST_ID,
  MINUTE_LINE,
  MINUTE,
  EXTRA_TIME,
  MIDDLE,
  SIDES,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/MinuteIncidents.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class MinuteIncidentsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the minute lines
   * @return {HTMLElement} MinuteIncident incidents list
   */
  get minuteLines() {
    return this.element.$$(MINUTE_LINE);
  }

  /**
   * Gets the minute component
   * @return {HTMLElement} MinuteIncident minute component
   */
  get middleComponent() {
    return this.element.$(MIDDLE);
  }

  /**
   * Gets the minutes
   * @return {HTMLElement} MinuteIncident minutes
   */
  get minutes() {
    return this.element.$(MINUTE);
  }

  /**
   * Gets the extra time
   * @return {HTMLElement} MinuteIncident extra time
   */
  get cardDescription() {
    return this.element.$(EXTRA_TIME);
  }

  /**
   * Gets the sides
   * @return {HTMLElement} MinuteIncident sides list
   */
  get sides() {
    return this.element.$$(SIDES);
  }
};
