const {
  TIMELINE_BAR,
  TIMELINE_BAR_INPLAY_BAR,
  TIMELINE_BAR_INCIDENTS_HOME,
  TIMELINE_BAR_INCIDENTS_AWAY,
  TIMELINE_BAR_CAPTION,
  TIMELINE_BAR_INCIDENTS_ICON,
} = require("@ppb/tbd-shared/components/MatchTimelineCard/snowflakes/TimelineBar/TimelineBar.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class TimelineBarSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${TIMELINE_BAR}`));
  }

  get timelineBarInplayBar() {
    return this.element.$(`~${TIMELINE_BAR_INPLAY_BAR}`);
  }

  get timelineBarHomeIncidents() {
    return this.element.$(`~${TIMELINE_BAR_INCIDENTS_HOME}`);
  }

  get timelineBarAwayIncidents() {
    return this.element.$(`~${TIMELINE_BAR_INCIDENTS_AWAY}`);
  }

  get timelineBarCaption() {
    return this.element.$(`~${TIMELINE_BAR_CAPTION}`);
  }

  get incidentsIcon() {
    return this.element.$$(`~${TIMELINE_BAR_INCIDENTS_ICON}`);
  }
}

module.exports = TimelineBarSO;
