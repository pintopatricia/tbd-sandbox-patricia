const {
  SLIDER,
  SLIDER_MINUS_BUTTON,
  SLIDER_PLUS_BUTTON,
} = require("@ppb/the-wall-web/components/bricks/Slider/Slider.selectors");
const styles = require("@ppb/the-wall-web/components/bricks/Slider/Slider.modules.json");
const { BasePO } = require("@ppb/wdio-lazy-element");

const TEST_ID = `[data-testid="${SLIDER}"]`;
const MINUS_BUTTON = `[data-testid="${SLIDER_MINUS_BUTTON}"]`;
const PLUS_BUTTON = `[data-testid="${SLIDER_PLUS_BUTTON}"]`;
const BUBBLE_LABEL = styles.bubbleLabel;

class SliderPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get buttons() {
    return [this.element.$(MINUS_BUTTON), this.element.$(PLUS_BUTTON)];
  }

  get slider() {
    return this.element.$(TEST_ID);
  }

  get tootTip() {
    return this.element.$(BUBBLE_LABEL);
  }
}

module.exports = SliderPO;
