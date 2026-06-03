const {
  TEST_ID,
  RUNNER_HOME,
  RUNNER_AWAY,
  DATE,
  INPLAY_LABEL,
  START_TIME,
} = require("@ppb/tbd-shared/components/EventViewLinkCard/snowflakes/SecondaryEventCard/SecondaryEventCard.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SecondaryEventCardPO extends BasePO {
  /**
   * Creates a secondary event card page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the home runner
   * @return {HTMLElement} The home runner
   */
  get runnerHome() {
    return this.element.$(RUNNER_HOME);
  }

  /**
   * Gets the away runner
   * @return {HTMLElement} The away runner
   */
  get runnerAway() {
    return this.element.$(RUNNER_AWAY);
  }

  /**
   * Gets the date
   * @return {HTMLElement} The event date
   */
  get date() {
    return this.element.$(DATE);
  }

  /**
   * Gets the inplay label
   * @return {HTMLElement} The inplay label
   */
  get inplayLabel() {
    return this.element.$(INPLAY_LABEL);
  }

  /**
   * Gets the start time
   * @return {HTMLElement} The event start time
   */
  get startTime() {
    return this.element.$(START_TIME);
  }
};
