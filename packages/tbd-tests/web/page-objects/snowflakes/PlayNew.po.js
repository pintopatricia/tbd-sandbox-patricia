const {
  TEST_ID,
  PN_CONTAINER,
  PN_LEFT_CONTENT,
  PN_TITLE,
  PN_SUBTITLE,
  PN_COUNTDOWN_TIMER,
  PN_TIMER,
  PN_TIMER_UNIT_TEXT,
  PN_TIMER_UNIT_VALUES,
  PN_BUTTON,
  PN_RIGHT_CONTENT,
  PN_LOGO_IMAGE,
  PN_MORE_INFO_CONTAINER,
  PN_MORE_INFO_LINK,
  PN_BADGE,
  PN_TIMER_CONTAINER,
} = require("@ppb/tbd-shared/components/GamingPlayNewCard/snowflakes/PlayNew/PlayNew.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class PlayNewPO extends BasePO {
  /**
   * Creates a Play New page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the play new container
   * @return {HTMLElement} The play new container
   */
  get container() {
    return this.element.$(PN_CONTAINER);
  }

  /**
   * Gets the play new left side content
   * @return {HTMLElement} The play new left side content
   */
  get leftContent() {
    return this.element.$(PN_LEFT_CONTENT);
  }

  /**
   * Gets the play new title
   * @return {HTMLElement} The play new title
   */
  get title() {
    return this.element.$(PN_TITLE);
  }

  /**
   * Gets the play new subtitle
   * @return {HTMLElement} The play new subtitle
   */
  get subtitle() {
    return this.element.$(PN_SUBTITLE);
  }

  /**
   * Gets the play new countdown timer
   * @return {HTMLElement} The play new countdown timer
   */
  get countDownTimer() {
    return this.element.$(PN_COUNTDOWN_TIMER);
  }

  /**
   * Gets the play new countdown timer container
   * @return {HTMLElement} The play new countdown timer container
   */
  get timerContainer() {
    return this.element.$(PN_TIMER_CONTAINER);
  }

  /**
   * Gets the play new  timer
   * @return {HTMLElement} The play new timer
   */
  get timer() {
    return this.element.$(PN_TIMER);
  }

  /**
   * Gets all play new timer units values.
   * @return {HTMLElement} The play new timer unit values
   */
  get timerUnitValueList() {
    return this.element.$$(PN_TIMER_UNIT_VALUES);
  }

  /**
   * Gets all play new timer labels
   * @return {HTMLElement} The play new timer labels
   */
  get timerUnitLabelList() {
    return this.element.$$(PN_TIMER_UNIT_TEXT);
  }

  /**
   * Gets the play new button
   * @return {HTMLElement} The play new button
   */
  get button() {
    return this.element.$(PN_BUTTON);
  }

  /**
   * Gets the play new right side content
   * @return {HTMLElement} The play new right side content
   */
  get rightContent() {
    return this.element.$(PN_RIGHT_CONTENT);
  }

  /**
   * Gets the play new logo image
   * @return {HTMLElement} The play new logo image
   */
  get logoImage() {
    return this.element.$(PN_LOGO_IMAGE);
  }

  /**
   * Gets the play new more info container
   * @return {HTMLElement} The play new more info container
   */
  get moreInfoContainer() {
    return this.element.$(PN_MORE_INFO_CONTAINER);
  }

  /**
   * Gets the play new more info link
   * @return {HTMLElement} The play new more info link
   */
  get moreInfoLink() {
    return this.element.$(PN_MORE_INFO_LINK);
  }

  /**
   * Gets the new badge
   * @return {HTMLElement} The new badge
   */
  get newBadge() {
    return this.element.$(PN_BADGE);
  }
};
