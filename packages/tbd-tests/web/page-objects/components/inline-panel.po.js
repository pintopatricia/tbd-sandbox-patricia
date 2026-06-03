const {
  TEST_ID,
  TITLE,
  TITLE_PREFIX,
  ACTION,
} = require("@ppb/tbd-shared/components/Betslip/InlinePanel/InlinePanel.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class InlinePanelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get titlePrefix() {
    return this.element.$(TITLE_PREFIX);
  }

  get title() {
    return this.element.$(TITLE);
  }

  get action() {
    return this.element.$(ACTION);
  }
}

module.exports = InlinePanelPO;
