const { PNL_AND_WHAT_IF_PNL } = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const {
  PRIMARY_BUTTON,
  LABEL,
  SECONDARY_LABEL,
} = require("@ppb/the-wall-native/components/ActionButton/PrimaryButton/PrimaryButton.selectors");
const ActionButtonSO = require("./action-button.so");

class PrimaryButtonSO extends ActionButtonSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PRIMARY_BUTTON}`));
  }

  get label() {
    return this.element.$(`~${LABEL}`);
  }

  get secondaryLabel() {
    return this.element.$(`~${SECONDARY_LABEL}`);
  }

  get pnl() {
    return this.element.$(`~${PNL_AND_WHAT_IF_PNL}`);
  }
}

module.exports = PrimaryButtonSO;
