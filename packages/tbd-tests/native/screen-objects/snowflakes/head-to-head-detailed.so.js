const {
  HEAD_TO_HEAD_DETAILED,
  HEAD_TO_HEAD_DETAILED_CAPTION,
  HEAD_TO_HEAD_DETAILED_RESULTS,
} = require("@ppb/tbd-shared/components/HeadToHeadCard/snowflakes/HeadToHeadDetailed/HeadToHeadDetailed.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class HeadToHeadDetailedSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${HEAD_TO_HEAD_DETAILED}`));
  }

  get headToHeadDetailedCaption() {
    return this.element.$(`~${HEAD_TO_HEAD_DETAILED_CAPTION}`);
  }

  get headToHeadDetailedResults() {
    return this.element.$$(`~${HEAD_TO_HEAD_DETAILED_RESULTS}`);
  }
}

module.exports = HeadToHeadDetailedSO;
