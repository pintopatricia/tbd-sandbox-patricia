const {
  RACE_DETAILS_PRIMARY_SUBTITLE,
  RACE_DETAILS_MEETING_TIME,
  RACE_DETAILS_MEETING_NAME,
} = require("@ppb/the-wall-native/components/RaceDetails/RaceDetails.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

const { VIRTUAL_EVENT_DETAILS_CARD } = require("./VirtualEventDetailsCard.native.selectors");

class VirtualEventRaceDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${VIRTUAL_EVENT_DETAILS_CARD}`));
  }

  get distance() {
    return this.element.$(`~${RACE_DETAILS_PRIMARY_SUBTITLE}`);
  }

  get meetingName() {
    return this.element.$(`~${RACE_DETAILS_MEETING_NAME}`);
  }

  get meetingTime() {
    return this.element.$(`~${RACE_DETAILS_MEETING_TIME}`);
  }
}

module.exports = VirtualEventRaceDetailsSO;
