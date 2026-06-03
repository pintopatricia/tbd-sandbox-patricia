const {
  TEST_ID,
  TITLE,
  ICON,
  EXPAND_ICON,
} = require("@ppb/the-wall-web/components/bricks/SupportingContentButton/SupportingContentButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SupportingContentButtonSO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get title() {
    return this.element.$(TITLE);
  }

  get icon() {
    return this.element.$(ICON);
  }

  get expandIcon() {
    return this.element.$(EXPAND_ICON);
  }
}

module.exports = SupportingContentButtonSO;
