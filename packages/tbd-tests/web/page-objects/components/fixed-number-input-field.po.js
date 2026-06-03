const { NUMBER_FIELD } = require("@ppb/the-wall-web/components/bricks/NumberInputField/NumberInputField.selectors");
const { PREVIOUS_VALUE } = require("@ppb/the-wall-web/components/walls/ValueIndicator/ValueIndicator.selectors");
const { TEST_ID: ODDS_MOVEMENT } = require("@ppb/the-wall-web/components/bricks/OddsMovement/OddsMovement.selectors");
const { TEST_ID } = require("@ppb/the-wall-web/components/walls/FixedNumberInputField/FixedNumberInputField.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FixedNumberInputFieldPO extends BasePO {
  /**
   * Creates a fixed number field page object instance
   * @param {LazyElement} [lazyElement]
   */
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get numberField() {
    return this.element.$(NUMBER_FIELD);
  }

  get previousValue() {
    return this.element.$(PREVIOUS_VALUE);
  }

  get oddsMovement() {
    return this.element.$(ODDS_MOVEMENT);
  }
}

module.exports = FixedNumberInputFieldPO;
