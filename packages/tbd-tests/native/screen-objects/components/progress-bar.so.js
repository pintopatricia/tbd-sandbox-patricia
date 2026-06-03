const {
  PROGRESS_BAR,
  PROGRESS_BAR_AWAY,
  PROGRESS_BAR_HOME,
} = require("@ppb/the-wall-native/components/ProgressBar/ProgressBar.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class ProgressBarSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${PROGRESS_BAR}`));
  }

  get awayBar() {
    return this.element.$(`~${PROGRESS_BAR_AWAY}`);
  }

  get homeBar() {
    return this.element.$(`~${PROGRESS_BAR_HOME}`);
  }
}

module.exports = ProgressBarSO;
