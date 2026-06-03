const { TEST_ID } = require("@ppb/tbd-shared/components/GridCard/GridCard.native.selectors");
const {
  TEST_ID: GRID_CARD_RUNNER,
} = require("@ppb/tbd-shared/components/GridCard/GridCardRunner/GridCardRunner.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class GridCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get runners() {
    return this.element.$$(`~${GRID_CARD_RUNNER}`);
  }
}

module.exports = GridCardSO;
