const {
  TEST_ID,
  TILE,
  TILE_TITLE,
  TILE_TITLE_ACTIVE,
  BROWSE_TILE,
  MY_BETS_TILE,
  PRODUCT_SWITCHER_TILE,
  PRODUCT_SWITCHER_TITLE,
  PRODUCT_SWITCHER_ICON,
  PRODUCT_SWITCHER_TILE_LABEL,
} = require("@ppb/the-wall-web/components/bricks/BottomBar/BottomBar.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BottomBarPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get tiles() {
    return this.element.$$(TILE);
  }

  get tileTitles() {
    return this.element.$$(TILE_TITLE);
  }

  get activeTileTitle() {
    return this.element.$(TILE_TITLE_ACTIVE);
  }

  static get states() {
    return {
      active: "_active",
    };
  }

  get browseTile() {
    return this.element.$(BROWSE_TILE);
  }

  get myBetsTile() {
    return this.element.$(MY_BETS_TILE);
  }

  get productSwitcherTile() {
    return this.element.$(PRODUCT_SWITCHER_TILE);
  }

  get productSwitcherTitle() {
    return this.element.$(PRODUCT_SWITCHER_TITLE);
  }

  get productSwitcherIcon() {
    return this.element.$(PRODUCT_SWITCHER_ICON);
  }

  get productSwitcherTileLabel() {
    return this.element.$(PRODUCT_SWITCHER_TILE_LABEL);
  }
}

module.exports = BottomBarPO;
