const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/Checkbox/Checkbox.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class CheckboxPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = CheckboxPO;
