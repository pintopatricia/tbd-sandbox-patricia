const {
  HIGHLIGHTED_FRAME,
  HIGHLIGHTED_FRAME_ICON,
} = require("@ppb/the-wall-native/components/bricks/HighlightedFrame/HighlightedFrame.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class QuickLinkSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HIGHLIGHTED_FRAME}`));
  }

  get icon() {
    return this.element.$(`~${HIGHLIGHTED_FRAME_ICON}`);
  }
}

module.exports = QuickLinkSO;
