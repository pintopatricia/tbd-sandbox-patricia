const {
  TEST_ID,
  NAME,
  NUMBER,
} = require("@ppb/tbd-shared/components/VirtualMarketCard/snowflakes/VirtualRunner/VirtualRunner.web.selectors");
const {
  TEST_ID: SBK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

class VirtualRunner extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get name() {
    return this.element.$(NAME);
  }

  get number() {
    return this.element.$(NUMBER);
  }

  get sportsbookBetButton() {
    return this.element.$(SBK_BET_BUTTON);
  }
}

module.exports = VirtualRunner;
