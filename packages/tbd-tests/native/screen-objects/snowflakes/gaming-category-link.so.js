const {
  GAMING_CATEGORY_LINK_CARD,
  GAMING_CATEGORY_LINK_CARD_LABEL,
  GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT,
} = require("@ppb/tbd-shared/components/GamesCardGroup/snowflakes/GamingCategoryLink/GamingCategoryLink.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GamingCategoryLinkPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GAMING_CATEGORY_LINK_CARD}`));
  }

  /**
   * Returns the snap groups of the inline market
   * Uses the `SNAP_GROUP` selector
   */
  get label() {
    return this.element.$$(`~${GAMING_CATEGORY_LINK_CARD_LABEL}`);
  }

  get button() {
    return this.element.$$(`~${GAMING_CATEGORY_LINK_CARD_BUTTON_TEXT}`);
  }
}

module.exports = GamingCategoryLinkPO;
