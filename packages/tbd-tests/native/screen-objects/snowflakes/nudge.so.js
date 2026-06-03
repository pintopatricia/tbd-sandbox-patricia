const { NUDGE } = require("@ppb/the-wall-native/components/Nudge/Nudge.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NudgeSO extends BaseSO {
  /**
   * Creates a nudges number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(`~${NUDGE}`));
  }
}

module.exports = NudgeSO;
