const {
  TEST_ID,
} = require("@ppb/tbd-shared/components/GamesCardGroup/snowflakes/GameTileContainer/GameTileContainer.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class GameTileContainerPO extends BasePO {
  /**
   * Creates a Game Tile Container page object instance
   * @param {LazyElement} lazyElement
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
