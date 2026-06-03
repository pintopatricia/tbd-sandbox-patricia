const {
  TEST_ID,
  LEFT_ARROW,
  RIGHT_ARROW,
} = require("@ppb/the-wall-web/components/bricks/MarketDepthButton/MarketDepthButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class MarketDepthButtonPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get leftArrow() {
    return this.element.$(LEFT_ARROW);
  }

  get rightArrow() {
    return this.element.$(RIGHT_ARROW);
  }
}

module.exports = MarketDepthButtonPO;
