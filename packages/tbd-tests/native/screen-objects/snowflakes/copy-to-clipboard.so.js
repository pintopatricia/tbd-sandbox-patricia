const {
  TEST_ID,
  CONTENT_LABEL,
  ICON,
} = require("@ppb/the-wall-native/components/CopyToClipboard/CopyToClipboard.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class CopyToClipboard extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get contentLabel() {
    return this.element.$(`~${CONTENT_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${ICON}`);
  }
}

module.exports = CopyToClipboard;
