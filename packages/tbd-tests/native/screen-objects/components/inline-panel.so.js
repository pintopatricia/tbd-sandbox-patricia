const {
  INLINE_PANEL,
  TITLE,
  ACTION,
} = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.native.selectors");
const { TITLE_PREFIX } = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class InlinePanelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INLINE_PANEL}`));
  }

  get titlePrefix() {
    return this.element.$(`~${TITLE_PREFIX}`);
  }

  get title() {
    return this.element.$(`~${TITLE}`);
  }

  get action() {
    return this.element.$(`~${ACTION}`);
  }
}

module.exports = InlinePanelSO;
