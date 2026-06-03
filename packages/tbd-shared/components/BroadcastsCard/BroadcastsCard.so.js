const { BasePO } = require("@ppb/wdio-lazy-element");
const {
  SUPPORTING_CONTENT_BUTTON,
  SUPPORTING_CONTENT_BUTTON_TITLE,
  SUPPORTING_CONTENT_BUTTON_ICON,
} = require("@ppb/the-wall-native/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BROADCASTS_CARD, LIVE_STREAM_CONTAINER } = require("./BroadcastsCard.native.selectors");

class BroadcastsCardSO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${BROADCASTS_CARD}`));
  }

  get header() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON}`);
  }

  get icon() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_ICON}`);
  }

  get title() {
    return this.element.$(`~${SUPPORTING_CONTENT_BUTTON_TITLE}`);
  }

  get livestreamContainer() {
    return this.element.$(`~${LIVE_STREAM_CONTAINER}`);
  }
}

module.exports = BroadcastsCardSO;
