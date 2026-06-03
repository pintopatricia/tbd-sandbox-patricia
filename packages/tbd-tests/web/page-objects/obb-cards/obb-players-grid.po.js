const { TEST_ID, PLAYER } = require("@ppb/tbd-shared/components/ObbPlayersGrid/ObbPlayersGrid.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbPlayerGridPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }

  get players() {
    return this.element.$$(PLAYER);
  }
};
