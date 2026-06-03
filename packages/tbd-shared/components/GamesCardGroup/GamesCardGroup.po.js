const { BasePO } = require("@ppb/wdio-lazy-element");

const { TEST_ID, TITLE, GAMES_GRID, GAME_CONTAINER } = require("./GamesCardGroup.web.selectors");

module.exports = class GamesCardGroupPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  /**
   * Gets the multifunctional module title
   * @return {HTMLElement} The multifunctional module title
   */
  get getTitle() {
    return this.element.$(TITLE);
  }

  /**
   * Gets games grid fron card group container
   * @return {HTMLElement} The games grid
   */
  get cardGroup() {
    return this.element.$(GAMES_GRID);
  }

  /**
   * Gets games containers from card group
   * @return {HTMLElement} The game containers
   */
  get gameContainers() {
    return this.element.$$(GAME_CONTAINER);
  }
};
