const {
  TEST_ID,
  TIMER_LABEL,
  TIMER_VALUES,
} = require("@ppb/tbd-shared/components/TimerCountDown/snowflakes/Timer/Timer.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class TimerPO extends BasePO {
  /**
   * Creates a Timer page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the timer label
   * @return {HTMLElement} The timer label
   */
  get timerLabel() {
    return this.element.$(TIMER_LABEL);
  }

  /**
   * Gets the timer values
   * @return {HTMLElement} The timer text
   */
  get timerValues() {
    return this.element.$(TIMER_VALUES);
  }
};
