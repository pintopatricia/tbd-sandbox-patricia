const {
  SECONDARY_BUTTON,
  LABEL,
  SECONDARY_LABEL,
} = require("@ppb/the-wall-web/components/bricks/SecondaryButton/SecondaryButton.selectors");
const ActionButtonPO = require("./action-button.po");

class SecondaryButtonPO extends ActionButtonPO {
  constructor(lazyElement) {
    super(lazyElement, $(SECONDARY_BUTTON));
  }

  get label() {
    return this.element.$(LABEL);
  }

  get secondaryLabel() {
    return this.element.$(SECONDARY_LABEL);
  }
}

module.exports = SecondaryButtonPO;
