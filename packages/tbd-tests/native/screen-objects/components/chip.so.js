const { CHIP, CHIP_TEXT, CHIP_ICON } = require("@ppb/the-wall-native/components/Chip/Chip.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ChipSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${CHIP}`));
  }

  get text() {
    return this.element.$(`~${CHIP_TEXT}`);
  }

  get icon() {
    return this.element.$(`~${CHIP_ICON}`);
  }
}

module.exports = ChipSO;
