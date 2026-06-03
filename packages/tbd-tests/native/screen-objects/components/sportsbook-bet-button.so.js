const {
  TEST_ID,
  CONTAINER,
  ICON_CONTAINER,
  LABEL,
  SECONDARY_LABEL,
} = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class SportsbookBetButtonSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get container() {
    return this.element.$(`~${CONTAINER}`);
  }

  get iconContainer() {
    return this.element.$(`~${ICON_CONTAINER}`);
  }

  get odd() {
    return this.element.$(`~${LABEL}`);
  }

  get secondaryLabel() {
    return this.element.$(`~${SECONDARY_LABEL}`);
  }
}

module.exports = SportsbookBetButtonSO;
