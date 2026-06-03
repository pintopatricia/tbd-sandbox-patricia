const {
  PROMO_BOOKMARK,
  PROMO_BOOKMARK_TEXT,
} = require("@ppb/the-wall-native/components/bricks/Indicators/PromoBookmark/PromoBookmark.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class PromoBookmarkSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PROMO_BOOKMARK}`));
  }

  get text() {
    return this.element.$(`~${PROMO_BOOKMARK_TEXT}`);
  }
}

module.exports = PromoBookmarkSO;
