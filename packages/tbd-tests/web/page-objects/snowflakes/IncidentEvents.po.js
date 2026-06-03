const {
  TEST_ID,
  INCIDENT,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/IncidentEvents/IncidentEvents.web.selectors");
const { BasePO } = require("@ppb/wdio-lazy-element");

module.exports = class IncidentEventsPO extends BasePO {
  constructor(lazyElement) {
    super(lazyElement, $(TEST_ID));
  }

  /**
   * Gets the incidents list
   * @return {HTMLElement} Incidents array
   */
  get incidents() {
    return this.element.$$(INCIDENT);
  }
};
