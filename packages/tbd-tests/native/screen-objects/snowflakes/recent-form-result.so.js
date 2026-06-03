const {
  RECENT_FORM_LABEL,
} = require("@ppb/the-wall-native/components/RecentForm/RecentFormIcon/RecentFormIcon.selectors");

const {
  RECENT_FORM_RESULT,
  RECENT_FORM_SCORE,
  RECENT_FORM_EXTRA_TIME,
  RECENT_FORM_SCORE_PENALTIES,
  RECENT_FORM_PENALTIES,
  RECENT_FORM_OPPONENT,
  RECENT_FORM_COMPETITION,
  RECENT_FORM_DATE,
} = require("@ppb/tbd-shared/components/RecentFormCard/snowflakes/RecentFormResult/RecentFormResult.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class RecentFormResultSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECENT_FORM_RESULT}`));
  }

  get score() {
    return this.element.$(`~${RECENT_FORM_SCORE}`);
  }

  get extraTimeLabel() {
    return this.element.$(`~${RECENT_FORM_EXTRA_TIME}`);
  }

  get scorePenalties() {
    return this.element.$(`~${RECENT_FORM_SCORE_PENALTIES}`);
  }

  get penaltiesLabel() {
    return this.element.$(`~${RECENT_FORM_PENALTIES}`);
  }

  get opponent() {
    return this.element.$(`~${RECENT_FORM_OPPONENT}`);
  }

  get competiton() {
    return this.element.$(`~${RECENT_FORM_COMPETITION}`);
  }

  get date() {
    return this.element.$(`~${RECENT_FORM_DATE}`);
  }

  get result() {
    return this.element.$(`~${RECENT_FORM_LABEL}`);
  }
}

module.exports = RecentFormResultSO;
