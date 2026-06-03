const {
  DURATION,
  DATE,
  TIME,
  SEPARATOR,
  NO_SCORE_ERROR,
  PREFIX_LABEL,
  STATUS_LABEL,
  EXTRA_TIME,
} = require("@ppb/the-wall-native/components/Scoreboard/Duration/Duration.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class DurationSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${DURATION}`));
  }

  get date() {
    return this.element.$(`~${DATE}`);
  }

  get time() {
    return this.element.$(`~${TIME}`);
  }

  get separator() {
    return this.element.$(`~${SEPARATOR}`);
  }

  get noScoreError() {
    return this.element.$(`~${NO_SCORE_ERROR}`);
  }

  get prefixLabel() {
    return this.element.$(`~${PREFIX_LABEL}`);
  }

  get statusLabel() {
    return this.element.$(`~${STATUS_LABEL}`);
  }

  get extraTime() {
    return this.element.$(`~${EXTRA_TIME}`);
  }
}

module.exports = DurationSO;
