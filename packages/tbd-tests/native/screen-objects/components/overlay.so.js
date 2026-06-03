const { OVERLAY } = require("@ppb/the-wall-native/components/Overlay/Overlay.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class OverlaySO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${OVERLAY}`));
  }
}

module.exports = OverlaySO;
