const { TEST_ID: ACTION_LINK } = require("@ppb/the-wall-web/components/bricks/ActionLink/ActionLink.selectors");
const {
  TEST_ID: TEST_ID_GAMETILE,
} = require("@ppb/tbd-shared/components/GameCard/snowflakes/GameTile/GameTile.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

const {
  TEST_ID,
  TITLE,
  GAMING_PAGE_CONTAINER,
  GAMING_CATEGORY_PAGE_CONTAINER,
  GAME_CONTAINER,
  GAMES_GRID,
  BACK_NAVIGATION_CONTAINER,
} = require("./gaming-page.selectors");

module.exports = class GamesPagePO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets the gaming page container
   * @return {HTMLElement} The gaming page container
   */
  get gamingPageContainer() {
    return this.element.$(GAMING_PAGE_CONTAINER);
  }

  /**
   * Gets the gaming category page container
   * @return {HTMLElement} The gaming category page container
   */
  get gamingCategoryPageContainer() {
    return this.element.$(GAMING_CATEGORY_PAGE_CONTAINER);
  }

  /**
   * Gets the title of the gaming page container
   * @return {HTMLElement} The title of the gaming page container
   */
  get title() {
    return this.element.$(TITLE);
  }

  /**
   * Gets the games grid
   * @return {HTMLElement} the games grid
   */
  get gamesGrid() {
    return this.element.$(GAMES_GRID);
  }

  /**
   * Gets a list of game containers
   * @return {HTMLElement} a list of game containers
   */
  get gameContainers() {
    return this.element.$$(GAME_CONTAINER);
  }

  /**
   * Gets a list of game tiles
   * @return {HTMLElement} a list of game tiles
   */
  get gameTiles() {
    return this.element.$$(TEST_ID_GAMETILE);
  }

  /**
   * Gets the See All category button
   * @return {HTMLElement} the See All category button
   */
  get categoryLinkButton() {
    return this.element.$(ACTION_LINK);
  }

  /**
   * Gets the gaming back navigation container
   * @return {HTMLElement} The gaming back navigation container
   */
  get backNavigationContainer() {
    return this.element.$(BACK_NAVIGATION_CONTAINER);
  }
};
