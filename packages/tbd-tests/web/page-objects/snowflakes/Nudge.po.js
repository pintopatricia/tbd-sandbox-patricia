const { NUDGE, NUDGE_ENABLED, NUDGE_DISABLED } = require("@ppb/the-wall-web/components/Nudge/Nudge.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class NudgesNumberInputFieldPO extends BasePO {
  /**
   * Creates a nudges number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(NUDGE));
  }

  get nudgeEnabled() {
    return this.element.$(NUDGE_ENABLED);
  }

  get nudgeDisabled() {
    return this.element.$(NUDGE_DISABLED);
  }
}

module.exports = NudgesNumberInputFieldPO;
