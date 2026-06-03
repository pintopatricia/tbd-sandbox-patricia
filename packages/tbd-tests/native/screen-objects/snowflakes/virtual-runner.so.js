const {
  TEST_ID,
  VIRTUAL_RUNNER_NAME,
  VIRTUAL_RUNNER_NUMBER,
} = require("@ppb/tbd-shared/components/VirtualMarketCard/snowflakes/VirtualRunner/VirtualRunner.native.selectors");
const {
  BET_BUTTON_TEST_ID,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/BetButton/BetButton.native.selectors");
const {
  TEST_ID: SPORTSBOOK_BET_BUTTONS,
} = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RunnerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TEST_ID}`));
  }

  get name() {
    return this.element.$(`~${VIRTUAL_RUNNER_NAME}`);
  }

  get number() {
    return this.element.$(`~${VIRTUAL_RUNNER_NUMBER}`);
  }

  get sbkBetButtons() {
    return this.element.$$(`~${SPORTSBOOK_BET_BUTTONS}`);
  }

  get betButtons() {
    return this.element.$$(`~${BET_BUTTON_TEST_ID}`);
  }
}

module.exports = RunnerSO;
