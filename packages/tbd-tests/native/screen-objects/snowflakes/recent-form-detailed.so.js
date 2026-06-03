const {
  RECENT_FORM_DETAILED,
  RECENT_FORM_DETAILED_RESULT_CONTAINER,
  RECENT_FORM_DETAILED_HOME,
  RECENT_FORM_DETAILED_AWAY,
  RECENT_FORM_DETAILED_CAPTION,
} = require("@ppb/tbd-shared/components/RecentFormCard/snowflakes/RecentFormDetailed/RecentFormDetailed.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RecentFormDetailedSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECENT_FORM_DETAILED}`));
  }

  get containers() {
    return this.element.$$(`~${RECENT_FORM_DETAILED_RESULT_CONTAINER}`);
  }

  get detailedHome() {
    return this.element.$(`~${RECENT_FORM_DETAILED_HOME}`);
  }

  get detailedAway() {
    return this.element.$(`~${RECENT_FORM_DETAILED_AWAY}`);
  }

  get caption() {
    return this.element.$(`~${RECENT_FORM_DETAILED_CAPTION}`);
  }
}

module.exports = RecentFormDetailedSO;
