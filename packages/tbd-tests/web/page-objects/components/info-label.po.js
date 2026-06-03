const {
  TEST_ID,
  INFO_LABEL_LABEL,
  INFO_LABEL_ODDS,
  INFO_LABEL_ICON,
} = require("@ppb/the-wall-web/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class InfoLabelPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get label() {
    return this.element.$(INFO_LABEL_LABEL);
  }

  get icon() {
    return this.element.$(INFO_LABEL_ICON);
  }

  get odds() {
    return this.element.$(INFO_LABEL_ODDS);
  }
}

module.exports = InfoLabelPO;
