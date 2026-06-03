const {
  TEST_ID: BADGE,
  ROULETTE_NUMBER: BADGE_ROULETTE_NUMBER,
  ROULETTE_NUMBERS,
  SEATS_AVAILABLE,
  JACKPOT,
} = require("@ppb/the-wall-web/components/walls/Badge/Badge.selectors");
const {
  TEST_ID,
  TILE_GRADIENT,
  BACKGROUND,
  LOGO,
  JACKPOT_LOGO,
  TITLE,
  COPYRIGHT,
  INFO_BUTTON,
  JACKPOT_VALUE_CONTAINER,
  CUSTOM_LOGO,
  ROUND,
  FAVOURITE_BUTTON,
} = require("@ppb/tbd-shared/components/GameCard/snowflakes/GameTile/GameTile.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GameTilePO extends BasePO {
  /**
   * Creates a Game Tile page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the tile gradient
   * @return {HTMLElement} The game tile gradient
   */
  get tileGradient() {
    return this.element.$(TILE_GRADIENT);
  }

  /**
   * Gets the game background
   * @return {HTMLElement} The game background image
   */
  get gameBackground() {
    return this.element.$(BACKGROUND);
  }

  /**
   * Gets the game logo
   * @return {HTMLElement} The game logo image
   */
  get gameLogo() {
    return this.element.$(LOGO);
  }

  /**
   * Gets the game title
   * @return {HTMLElement} The game title
   */
  get gameTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the game copyright text
   * @return {HTMLElement} The game copyright text
   */
  get gameCopyright() {
    return this.element.$(COPYRIGHT);
  }

  /**
   * Gets the game jackpot logo
   * @return {HTMLElement} The jackpot logo
   */
  get jackpotLogo() {
    return this.element.$(JACKPOT_LOGO);
  }

  get customLogoImage() {
    return this.element.$(CUSTOM_LOGO);
  }

  /**
   * Gets the game info button
   * @return {HTMLElement} The game info button
   */
  get gameInfoButton() {
    return this.element.$(INFO_BUTTON);
  }

  /**
   * Gets the game badge
   * @return {HTMLElement} The game badge
   */
  get badge() {
    return this.element.$(BADGE);
  }

  /**
   * Gets a list of roulette numbers
   * @return {HTMLElement} A list of roulette numbers
   */
  get badgeRouletteNumbers() {
    return this.element.$$(BADGE_ROULETTE_NUMBER);
  }

  /**
   * Gets the jackpot value container for the round layout
   * @return {HTMLElement} The jackpot value container for the round layout
   */
  get gameJackpotContainer() {
    return this.element.$(JACKPOT_VALUE_CONTAINER);
  }

  /**
   * Gets the favourites button
   * @return {HTMLElement} The favourites button container
   */
  get getFavouriteButton() {
    return this.element.$(FAVOURITE_BUTTON);
  }

  static get states() {
    return {
      rouletteNumbers: ROULETTE_NUMBERS.replace(".", ""),
      seatsAvailable: SEATS_AVAILABLE.replace(".", ""),
      jackpot: JACKPOT.replace(".", ""),
      round: ROUND.replace(".", ""),
    };
  }
};
