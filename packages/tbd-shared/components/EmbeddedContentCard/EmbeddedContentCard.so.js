const { BaseSO } = require("@ppb/wdio-lazy-element");

const {
  EMBEDDED_CONTENT_CARD,
  EMBEDDED_CONTENT_CARD_LIVE_STREAM,
} = require("@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.selectors");

class EmbeddedContentCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${EMBEDDED_CONTENT_CARD}`));
  }

  get embeddedVideo() {
    return this.element.$(`~${EMBEDDED_CONTENT_CARD_LIVE_STREAM}`);
  }
}

module.exports = EmbeddedContentCardSO;
