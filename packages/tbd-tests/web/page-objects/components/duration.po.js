const {
  TEST_ID,
  DATETIME,
  STATUS,
  STATUS_ERROR,
  EXTRA_TIME,
  DATE,
  TIME,
  END_STATUS,
} = require("@ppb/the-wall-web/components/bricks/Duration/Duration.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class DurationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      end: END_STATUS.replace(".", ""),
    };
  }

  /**
   * Gets the datetime of the event from the scoreboard (Day Month Year format, Hour and minute), only available on PRE_MATCH or PRE_PLAY state
   * @return {HTMLElement} Scoreboard date of the event (day month year format, hour:minute format)
   */
  get datetime() {
    return this.element.$(DATETIME);
  }

  get date() {
    return this.element.$(DATE);
  }

  get time() {
    return this.element.$(TIME);
  }

  /**
   * Gets the status element (Only available on HALF or FULL status)
   * @return {HTMLElement} Scoreboard status (HT or FT)
   */
  get status() {
    return this.element.$(STATUS);
  }

  /**
   * Gets the status error element (Only available when score is not retreived)
   * @return {HTMLElement} Scoreboard status error (In-play)
   */
  get statusError() {
    return this.element.$(STATUS_ERROR);
  }

  /**
   * Gets the extraTime element (Available on INPLAY_FIRST_HALF, INPLAY_SECOND_HALF status with EXTRA period type)
   * @return {HTMLElement} Scoreboard extraTime element
   */
  get extraTime() {
    return this.element.$(EXTRA_TIME);
  }
};
