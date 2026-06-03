const {
  TEST_ID,
  RUNNER_NAME,
  RUNNER_BUTTON,
  RUNNER_MARKET_GRAPH,
} = require("@ppb/the-wall-web/components/walls/Runner/Runner.selectors");
const {
  TEST_ID: EXC_BET_BUTTONS,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/ExchangeBetButton/ExchangeBetButton.web.selectors");
const {
  TEST_ID: SBK_BET_BUTTON,
} = require("@ppb/the-wall-web/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { TEST_ID: PNL_AND_WHAT_IF } = require("@ppb/the-wall-web/components/bricks/PNLAndWhatIf/PNLAndWhatIf.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class RunnerPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  get runnerName() {
    return this.element.$(RUNNER_NAME);
  }

  get pnlAndWhatIf() {
    return this.element.$(PNL_AND_WHAT_IF);
  }

  get exchangeBetButtons() {
    return this.element.$$(EXC_BET_BUTTONS);
  }

  get sportsbookBetButton() {
    return this.element.$(SBK_BET_BUTTON);
  }

  get runnerButton() {
    return this.element.$(RUNNER_BUTTON);
  }

  get runnerMarketGraphIcon() {
    return this.element.$(RUNNER_MARKET_GRAPH);
  }
};
