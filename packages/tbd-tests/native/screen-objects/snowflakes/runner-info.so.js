const {
  RUNNER_INFO,
  RUNNER_INFO_SILK,
  RUNNER_INFO_SILK_DEFAULT,
  RUNNER_INFO_NAME,
  RUNNER_INFO_JOCKEY_LABEL,
  RUNNER_INFO_JOCKEY_NAME,
  RUNNER_INFO_TRAINER_LABEL,
  RUNNER_INFO_TRAINER_NAME,
} = require("@ppb/tbd-shared/components/RunnerInfoCard/snowflakes/RunnerInfo/RunnerInfo.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RunnerInfoSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RUNNER_INFO}`));
  }

  get silk() {
    return this.element.$(`~${RUNNER_INFO_SILK}`);
  }

  get defaultSilk() {
    return this.element.$(`~${RUNNER_INFO_SILK_DEFAULT}`);
  }

  get runnerName() {
    return this.element.$(`~${RUNNER_INFO_NAME}`);
  }

  get jockeyLabel() {
    return this.element.$(`~${RUNNER_INFO_JOCKEY_LABEL}`);
  }

  get jockeyName() {
    return this.element.$(`~${RUNNER_INFO_JOCKEY_NAME}`);
  }

  get trainerLabel() {
    return this.element.$(`~${RUNNER_INFO_TRAINER_LABEL}`);
  }

  get trainerName() {
    return this.element.$(`~${RUNNER_INFO_TRAINER_NAME}`);
  }
}

module.exports = RunnerInfoSO;
