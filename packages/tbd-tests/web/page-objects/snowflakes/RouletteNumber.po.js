const TEST_ID = require("@ppb/the-wall-web/components/bricks/RouletteNumber/RouletteNumber.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RouletteNumberPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
