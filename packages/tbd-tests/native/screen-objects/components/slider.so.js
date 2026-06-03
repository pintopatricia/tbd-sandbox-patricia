const {
  SLIDER,
  SLIDER_MINUS_BUTTON,
  SLIDER_PLUS_BUTTON,
  SLIDER_KNOB,
} = require("@ppb/the-wall-native/components/Slider/Slider.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class SliderSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${SLIDER}`));
  }

  get minusButton() {
    return this.element.$(`~${SLIDER_MINUS_BUTTON}`);
  }

  get plusButton() {
    return this.element.$(`~${SLIDER_PLUS_BUTTON}`);
  }

  get knob() {
    return this.element.$(`~${SLIDER_KNOB}`);
  }
}

module.exports = SliderSO;
