const {
  SECONDARY_BUTTON,
  LABEL,
} = require("@ppb/the-wall-native/components/ActionButton/SecondaryButton/SecondaryButton.selectors");
const ActionButtonSO = require("./action-button.so");

class SecondaryButtonSO extends ActionButtonSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SECONDARY_BUTTON}`));
  }

  get label() {
    return this.element.$(`~${LABEL}`);
  }
}

module.exports = SecondaryButtonSO;
