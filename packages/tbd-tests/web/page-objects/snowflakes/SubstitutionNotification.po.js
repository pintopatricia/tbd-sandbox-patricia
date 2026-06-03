const {
  TEST_ID,
  TITLE,
  PLAYER_IN,
  PLAYER_OUT,
  SVG_PLAYER_IN,
  SVG_PLAYER_OUT,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MinuteIncidents/snowflakes/SubstitutionNotification/SubstitutionNotification.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SubstitutionNotificationPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the substitution notification title
   * @return {HTMLElement} SubstitutionNotification title
   */
  get substitutionNotificationTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the substitution player in
   * @return {HTMLElement} SubstitutionNotification player in
   */
  get substitutionPlayerIn() {
    return this.element.$(PLAYER_IN);
  }

  /**
   * Gets the substitution player out
   * @return {HTMLElement} SubstitutionNotification player out
   */
  get substitutionPlayerOut() {
    return this.element.$(PLAYER_OUT);
  }

  /**
   * Gets the substitution player in svg
   * @return {HTMLElement} SubstitutionNotification player in svg
   */
  get substitutionPlayerInSvg() {
    return this.element.$(SVG_PLAYER_IN);
  }

  /**
   * Gets the substitution player out svg
   * @return {HTMLElement} SubstitutionNotification player out svg
   */
  get substitutionPlayerOutSvg() {
    return this.element.$(SVG_PLAYER_OUT);
  }
};
