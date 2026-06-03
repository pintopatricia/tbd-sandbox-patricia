const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Chip/Chip.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class ChipPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = ChipPO;
