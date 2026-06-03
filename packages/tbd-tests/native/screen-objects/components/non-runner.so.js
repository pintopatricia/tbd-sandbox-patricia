const {
  NON_RUNNER,
  NON_RUNNER_TITLE,
  NON_RUNNER_DATE,
  NON_RUNNER_REDUCTION,
} = require("@ppb/the-wall-native/components/NonRunner/NonRunner.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class NonRunnerSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${NON_RUNNER}`));
  }

  get nonRunnerTitle() {
    return this.element.$(`~${NON_RUNNER_TITLE}`);
  }

  get nonRunnerDate() {
    return this.element.$(`~${NON_RUNNER_DATE}`);
  }

  get nonRunnerReduction() {
    return this.element.$(`~${NON_RUNNER_REDUCTION}`);
  }
}

module.exports = NonRunnerSO;
