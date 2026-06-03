const {
  MATCH_TIMELINE_DETAILS,
  MTD_MATCH_TIMELINE,
  MTD_INCIDENT_EVENTS,
  MTD_MINUTE_BY_MINUTE,
  MTD_MINUTE_BY_MINUTE_TITLE,
  MTD_MBM_EXTRA_TIME_SH,
  MTD_MBM_EXTRA_TIME_FH,
  MTD_MBM_SECOND_HALF,
  MTD_MBM_FIRST_HALF,
  MTD_MATCH_STATS,
  MTD_EXTRA_END_CONTAINER,
  MTD_EXTRA_FH_END_CONTAINER,
  MTD_FULL_TIME_END_CONTAINER,
  MTD_HALF_TIME_END_CONTAINER,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/MatchTimelineDetails/MatchTimelineDetails.native.selectors");

const { BaseSO } = require("@ppb/wdio-lazy-element");

class MatchTimelineDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${MATCH_TIMELINE_DETAILS}`));
  }

  get matchTimeline() {
    return this.element.$(`~${MTD_MATCH_TIMELINE}`);
  }

  get incidentEvents() {
    return this.element.$(`~${MTD_INCIDENT_EVENTS}`);
  }

  get minuteByMinute() {
    return this.element.$(`${MTD_MINUTE_BY_MINUTE}`);
  }

  get minuteByMinuteTitle() {
    return this.element.$(`~${MTD_MINUTE_BY_MINUTE_TITLE}`);
  }

  get minuteByMinuteExtraTimeSh() {
    return this.element.$(`~${MTD_MBM_EXTRA_TIME_SH}`);
  }

  get minuteByMinuteExtratimeFh() {
    return this.element.$(`~${MTD_MBM_EXTRA_TIME_FH}`);
  }

  get minuteByMinuteSecondHalf() {
    return this.element.$(`~${MTD_MBM_SECOND_HALF}`);
  }

  get minuteByMinuteFirstHalf() {
    return this.element.$(`~${MTD_MBM_FIRST_HALF}`);
  }

  get matchStats() {
    return this.element.$$(`~${MTD_MATCH_STATS}`);
  }

  get extraEndContainer() {
    return this.element.$(`~${MTD_EXTRA_END_CONTAINER}`);
  }

  get extraFhEndContainer() {
    return this.element.$(`~${MTD_EXTRA_FH_END_CONTAINER}`);
  }

  get fullTimeEndContainer() {
    return this.element.$(`~${MTD_FULL_TIME_END_CONTAINER}`);
  }

  get halfTimeEndContainer() {
    return this.element.$(`~${MTD_HALF_TIME_END_CONTAINER}`);
  }
}

module.exports = MatchTimelineDetailsSO;
