const {
  TEST_ID,
  LEFT_LABEL,
  MID_VALUE,
  MID_LABEL,
  MID_RIGHT_VALUE,
  MID_RIGHT_LABEL,
  RIGHT_LABEL,
  DOT,
  BLUE_DOT,
  PINK_DOT,
  LEFT_VALUE_CONTAINER,
  RIGHT_VALUE_CONTAINER,
} = require("@ppb/the-wall-web/components/bricks/BetSegments/BetSegments.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class BetSegmentsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get leftValue() {
    return this.element.$(LEFT_VALUE_CONTAINER);
  }

  get leftLabel() {
    return this.element.$(LEFT_LABEL);
  }

  get midValue() {
    return this.element.$(MID_VALUE);
  }

  get midLabel() {
    return this.element.$(MID_LABEL);
  }

  get midRightValue() {
    return this.element.$(MID_RIGHT_VALUE);
  }

  get midRightLabel() {
    return this.element.$(MID_RIGHT_LABEL);
  }

  get rightValue() {
    return this.element.$(RIGHT_VALUE_CONTAINER);
  }

  get rightLabel() {
    return this.element.$(RIGHT_LABEL);
  }

  get dot() {
    return this.element.$(DOT);
  }

  get blueDot() {
    return this.element.$(BLUE_DOT);
  }

  get pinkDot() {
    return this.element.$(PINK_DOT);
  }
}

module.exports = BetSegmentsPO;
