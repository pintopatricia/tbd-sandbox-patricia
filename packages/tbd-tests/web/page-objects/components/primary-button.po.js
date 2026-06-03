const {
  PRIMARY_BUTTON,
  LABEL,
  SECONDARY_LABEL,
} = require("@ppb/the-wall-web/components/bricks/PrimaryButton/PrimaryButton.selectors");
const { PNL } = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");
const ActionButtonPO = require("./action-button.po");

class PrimaryButtonPO extends ActionButtonPO {
  constructor(lazyElement) {
    super(lazyElement, $(PRIMARY_BUTTON));
  }

  get label() {
    return this.element.$(LABEL);
  }

  get secondaryLabel() {
    return this.element.$(SECONDARY_LABEL);
  }

  get pnl() {
    return this.element.$(PNL);
  }
}

module.exports = PrimaryButtonPO;
