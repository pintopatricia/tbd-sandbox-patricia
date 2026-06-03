const { BasePO } = require("@ppb/wdio-lazy-element");

const TEST_ID = "#user-profile-iframe";
module.exports = class DepositsPagePO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
};
