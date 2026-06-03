const {
  RUNNER_NAME,
  RUNNER_BUTTON,
  RUNNER,
  RUNNER_CLICKABLE,
  RUNNER_DETAILS,
  RUNNER_MARKET_GRAPH_ICON,
} = require("@ppb/the-wall-native/components/Runner/Runner.selectors");
const {
  TEST_ID: SPORTSBOOK_BET_BUTTONS,
} = require("@ppb/the-wall-native/components/SportsbookBetButton/SportsbookBetButton.selectors");
const { PNL_AND_WHAT_IF } = require("@ppb/the-wall-native/components/PNLAndWhatIf/PNLAndWhatIf.selectors");
const {
  BET_BUTTON_TEST_ID,
} = require("@ppb/tbd-shared/components/ExchangeBetButtons/snowflakes/BetButton/BetButton.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RunnerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RUNNER}`));
  }

  get runnerName() {
    return this.element.$(`~${RUNNER_NAME}`);
  }

  get pnlAndWhatIf() {
    return this.element.$(`~${PNL_AND_WHAT_IF}`);
  }

  get sbkBetButtons() {
    return this.element.$$(`~${SPORTSBOOK_BET_BUTTONS}`);
  }

  get betButtons() {
    return this.element.$$(`~${BET_BUTTON_TEST_ID}`);
  }

  get runnerButton() {
    return this.element.$(`~${RUNNER_BUTTON}`);
  }

  get runnerClickable() {
    return this.element.$(`~${RUNNER_CLICKABLE}`);
  }

  get runnerDetails() {
    return this.element.$(`~${RUNNER_DETAILS}`);
  }

  get runnerMarketGraphIcon() {
    return this.element.$(`~${RUNNER_MARKET_GRAPH_ICON}`);
  }
}

module.exports = RunnerSO;
