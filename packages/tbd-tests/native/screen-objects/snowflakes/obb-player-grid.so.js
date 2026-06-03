const {
  TEST_ID,
  PLAYER_CONTAINER,
} = require("@ppb/tbd-shared/components/ObbPlayersGrid/ObbPlayersGrid.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbPlayerGridSO extends BaseSO {
  constructor() {
    super($(`~${TEST_ID}`));
  }

  get selectedPlayer() {
    return this.element.$$(`~${PLAYER_CONTAINER}`);
  }
};
