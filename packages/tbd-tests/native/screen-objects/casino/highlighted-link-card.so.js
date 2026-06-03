const {
  HIGHLIGHTED_LINK_CARD,
  HIGHLIGHTED_LINK_CARD_MARKET_NAME,
  HIGHLIGHTED_LINK_CARD_ARROW_ICON,
  HIGHLIGHTED_LINK_CARD_ICON,
} = require("@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HighlightedLinkCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HIGHLIGHTED_LINK_CARD}`));
  }

  get highlightedLinkCard() {
    return this.element.$(`~${HIGHLIGHTED_LINK_CARD}`);
  }

  get highlightedLinkCardMarketName() {
    return this.element.$(`~${HIGHLIGHTED_LINK_CARD_MARKET_NAME}`);
  }

  get highlightedLinkCardArrowIcon() {
    return this.element.$(`~${HIGHLIGHTED_LINK_CARD_ARROW_ICON}`);
  }

  get highlightedLinkCardIcon() {
    return this.element.$(`~${HIGHLIGHTED_LINK_CARD_ICON}`);
  }
}

module.exports = HighlightedLinkCardSO;
