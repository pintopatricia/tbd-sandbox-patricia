const { TEST_ID } = require("@ppb/tbd-shared/components/ObbPlayersModal/ObbPlayersModal.web.selectors");

const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class ObbPlayersModalPO extends BasePO {
  constructor() {
    super($(TEST_ID));
  }
};
