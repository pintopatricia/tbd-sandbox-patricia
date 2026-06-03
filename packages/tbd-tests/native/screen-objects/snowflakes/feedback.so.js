const { FEEDBACK_BUTTON } = require("@ppb/tbd-shared/components/Feedback/Feedback.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class FeedbackSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${FEEDBACK_BUTTON}`));
  }
}

module.exports = FeedbackSO;
