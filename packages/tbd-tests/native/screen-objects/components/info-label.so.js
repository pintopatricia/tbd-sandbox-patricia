const {
  INFO_LABEL,
  INFO_LABEL_LABEL,
  INFO_LABEL_ODDS,
  INFO_LABEL_ICON,
} = require("@ppb/the-wall-native/components/bricks/Indicators/InfoLabel/InfoLabel.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class InfoLabelPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${INFO_LABEL}`));
  }

  get label() {
    return this.element.$(`~${INFO_LABEL_LABEL}`);
  }

  get icon() {
    return this.element.$(`~${INFO_LABEL_ICON}`);
  }

  get odds() {
    return this.element.$(`~${INFO_LABEL_ODDS}`);
  }
}

module.exports = InfoLabelPO;
