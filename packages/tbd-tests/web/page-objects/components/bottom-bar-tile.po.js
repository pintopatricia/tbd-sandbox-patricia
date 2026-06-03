const {
  TILE: TEST_ID,
  TILE_TITLE,
  TILE_LINK,
} = require("@ppb/the-wall-web/components/bricks/BottomBar/BottomBar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BottomBarTilePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TILE_TITLE);
  }

  get link() {
    return this.element.$(TILE_LINK);
  }
}

module.exports = BottomBarTilePO;
