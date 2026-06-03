const {
  TEST_ID,
  STATUS_LABEL_ICON,
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-web/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class StatusLabelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get text() {
    return this.element.$(STATUS_LABEL_LABEL);
  }

  get icon() {
    return this.element.$(STATUS_LABEL_ICON);
  }
}

module.exports = StatusLabelPO;
