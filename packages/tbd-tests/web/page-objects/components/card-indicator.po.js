const {
  TEST_ID,
  CARD_INDICATOR,
  CARD_INDICATOR_GROUP,
  REVERSED,
} = require("@ppb/the-wall-web/components/bricks/CardIndicator/CardIndicator.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CardIndicatorPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get cardIndicator() {
    return this.element.$(CARD_INDICATOR);
  }

  get cardIndicatorGroup() {
    return this.element.$(CARD_INDICATOR_GROUP);
  }

  get reversed() {
    return this.element.$(REVERSED);
  }
}

module.exports = CardIndicatorPO;
