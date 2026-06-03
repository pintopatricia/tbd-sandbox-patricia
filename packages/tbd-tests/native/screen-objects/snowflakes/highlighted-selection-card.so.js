const {
  HIGHLIGHTED_SELECTION_CARD,
  HIGHLIGHTED_SELECTION_CARD_TEXT,
  HIGHLIGHTED_SELECTION_CARD_BUTTON,
} = require("@ppb/tbd-shared/components/HighlightedSelectionCard/snowflakes/HighlightedSelectionCard/HighlightedSelectionCard.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HighlightedSelectionCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HIGHLIGHTED_SELECTION_CARD}`));
  }

  get text() {
    return this.element.$(`~${HIGHLIGHTED_SELECTION_CARD_TEXT}`);
  }

  get button() {
    return this.element.$(`~${HIGHLIGHTED_SELECTION_CARD_BUTTON}`);
  }
}

module.exports = HighlightedSelectionCardSO;
