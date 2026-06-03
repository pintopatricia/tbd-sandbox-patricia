const {
  TEST_ID,
  LABEL,
  SECONDARY_LABEL,
  SELECTED,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class SportsbookBetButtonPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  static get states() {
    return {
      selected: SELECTED.replace(".", ""),
    };
  }

  get sportsbookBetButton() {
    return this.element;
  }

  get odd() {
    return this.element.$(LABEL);
  }

  get secondaryLabel() {
    return this.element.$(SECONDARY_LABEL);
  }
}

module.exports = SportsbookBetButtonPO;
