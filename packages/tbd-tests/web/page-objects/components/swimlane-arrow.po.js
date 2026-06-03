const { TEST_ID } = require("@ppb/the-wall-web/components/bricks/SwimlaneArrow/SwimlaneArrow.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class SwimlaneArrowPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
