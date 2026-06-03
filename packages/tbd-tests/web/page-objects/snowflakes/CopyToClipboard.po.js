const {
  TEST_ID,
  LABEL,
  ICON,
} = require("@ppb/the-wall-web/components/bricks/CopyToClipboard/CopyToClipboard.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CopyToClipboard extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get contentLabel() {
    return this.element.$(LABEL);
  }

  get icon() {
    return this.element.$(ICON);
  }
}

module.exports = CopyToClipboard;
