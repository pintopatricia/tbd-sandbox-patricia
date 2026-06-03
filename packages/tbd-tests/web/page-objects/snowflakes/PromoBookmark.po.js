const {
  PROMO_BOOKMARK,
  PROMO_BOOKMARK_TEXT,
} = require("@ppb/the-wall-web/components/bricks/Indicators/PromoBookmark/PromoBookmark.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class PromoBookmarkPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(PROMO_BOOKMARK));
  }

  get text() {
    return this.element.$(PROMO_BOOKMARK_TEXT);
  }
}

module.exports = PromoBookmarkPO;
