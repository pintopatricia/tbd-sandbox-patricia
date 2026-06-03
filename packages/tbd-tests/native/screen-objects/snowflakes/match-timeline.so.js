const {
  MATCH_TIMELINE,
  MATCH_TIMELINE_PREMATCH,
  MATCH_TIMELINE_TIMELINE_CONTAINER,
  MATCH_TIMELINE_HOME_CREST,
  MATCH_TIMELINE_AWAY_CREST,
  MATCH_TIMELINE_HOME_SHIELD_CREST,
  MATCH_TIMELINE_AWAY_SHIELD_CREST,
  MATCH_TIMELINE_TIMELINE,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MatchTimeline/MatchTimeline.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class MatchTimelineSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MATCH_TIMELINE}`));
  }

  get prematch() {
    return this.element.$(`~${MATCH_TIMELINE_PREMATCH}`);
  }

  get timelines() {
    return this.element.$$(`~${MATCH_TIMELINE_TIMELINE}`);
  }

  get timelineContainer() {
    return this.element.$(`~${MATCH_TIMELINE_TIMELINE_CONTAINER}`);
  }

  get homeCrest() {
    return this.element.$(`~${MATCH_TIMELINE_HOME_CREST}`);
  }

  get awayCrest() {
    return this.element.$(`~${MATCH_TIMELINE_AWAY_CREST}`);
  }

  get homeShieldCrest() {
    return this.element.$(`~${MATCH_TIMELINE_HOME_SHIELD_CREST}`);
  }

  get awayShieldCrest() {
    return this.element.$(`~${MATCH_TIMELINE_AWAY_SHIELD_CREST}`);
  }
}

module.exports = MatchTimelineSO;
