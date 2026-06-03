const { TEST_ID, RUNNER_NAME } = require("@ppb/the-wall-web/components/walls/RacingRunner/RacingRunner.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RacingRunner extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runnerName() {
    return this.element.$(RUNNER_NAME);
  }
};
