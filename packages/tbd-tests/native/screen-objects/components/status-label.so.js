const {
  STATUS_LABEL,
  STATUS_LABEL_ICON,
  STATUS_LABEL_LABEL,
} = require("@ppb/the-wall-native/components/bricks/Indicators/StatusLabel/StatusLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class StatusLabelSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${STATUS_LABEL}`));
  }

  get text() {
    return this.element.$(`~${STATUS_LABEL_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${STATUS_LABEL_ICON}`);
  }
}

module.exports = StatusLabelSO;
