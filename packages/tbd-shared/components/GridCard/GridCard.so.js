const { BaseSO } = require("@ppb/wdio-lazy-element");
const { TEST_ID } = require("./GridCard.native.selectors");
const { TEST_ID: GRID_CARD_RUNNER } = require("./GridCardRunner/GridCardRunner.native.selectors");

module.exports = class GridCardPO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get runners() {
    return this.element.$$(`~${GRID_CARD_RUNNER}`);
  }
};
