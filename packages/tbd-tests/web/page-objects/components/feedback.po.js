const { TEST_ID } = require("@ppb/tbd-shared/components/Feedback/Feedback.web.selectors.js");
const { BasePO } = require("@ppb/wdio-lazy-element");

class FeedbackPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }
}

module.exports = FeedbackPO;
