const {
  TEST_ID,
  TITLE,
  KEY_INFO,
  KEY_INFO_PILLS,
  TABLE,
  TABLE_CONTENT,
  GAME_HELP,
  HOW_TO_PLAY_HEADLINE,
  PLAY_NOW_BUTTON,
  PLAY_NOW_BUTTON_URL,
  DEMO_BUTTON,
  FAVOURITE_BUTTON,
} = require("@ppb/tbd-shared/components/GameInfo/snowflakes/GameInfo/GameInfo.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GameInfoPO extends BasePO {
  /**
   * Creates a Game Info page object instance
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the how to play details
   * @return {HTMLElement} The how to play details
   */
  get howToPlayHeadline() {
    return this.element.$(HOW_TO_PLAY_HEADLINE);
  }

  /**
   * Gets the game title
   * @return {HTMLElement} The game title
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the key info pills section
   * @return {HTMLElement} The game key info pills section
   */
  get keyInfoPillsSection() {
    return this.element.$(KEY_INFO);
  }

  /**
   * Gets the key info pills
   * @return {HTMLElement} The game key info pills
   */
  get keyInfoPills() {
    return this.element.$$(KEY_INFO_PILLS);
  }

  /**
   * Gets the game metadata table
   * @return {HTMLElement} The game metadata table
   */
  get table() {
    return this.element.$(TABLE);
  }

  /**
   * Gets the game metadata table content
   * @return {HTMLElement} The game metadata table content
   */
  get tableContent() {
    return this.element.$$(TABLE_CONTENT);
  }

  /**
   * Gets the game help
   * @return {HTMLElement} The game help
   */
  get gameHelp() {
    return this.element.$(GAME_HELP);
  }

  /**
   * Gets the play now button
   * @return {HTMLElement} The play now button
   */
  get playNowButton() {
    return this.element.$(PLAY_NOW_BUTTON);
  }

  /**
   * Gets the demo  button
   *  @return {HTMLElement} The play now button
   */
  get demoButton() {
    return this.element.$(DEMO_BUTTON);
  }

  /**
   * Gets the game launch url
   * @return {HTMLElement} The game launch url
   */
  get launchGame() {
    return this.element.$(PLAY_NOW_BUTTON_URL);
  }

  /**
   * Gets the favourite button
   * @return {HTMLElement} The favourite button
   */
  get getFavouriteButton() {
    return this.element.$(FAVOURITE_BUTTON);
  }
};
