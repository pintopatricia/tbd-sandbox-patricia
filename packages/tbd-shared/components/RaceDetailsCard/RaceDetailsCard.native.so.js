const {
  RACE_DETAILS_NAME,
  RACE_DETAILS_MEETING_INFO,
  RACE_DETAILS_MEETING_FLAG,
  RACE_DETAILS_PRIMARY_SUBTITLE,
  RACE_DETAILS_PRIMARY_SUBTITLE_LEFT,
  RACE_DETAILS_PRIMARY_SUBTITLE_RIGHT,
  RACE_DETAILS_NUMBER_OF_RUNNERS,
  RACE_DETAILS_TRACK_GOING,
  RACE_DETAILS_RACE_STATUS,
  RACE_DETAILS_MEETING_TIME,
  RACE_DETAILS_MEETING_NAME,
} = require("@ppb/the-wall-native/components/RaceDetails/RaceDetails.selectors");

const { TEXT_TICKER } = require("@ppb/the-wall-native/components/TextTicker/TextTicker.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

const { RACE_DETAILS_CARD } = require("./RaceDetailsCard.native.selectors");

class RaceDetailsSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACE_DETAILS_CARD}`));
  }

  get status() {
    return this.element.$(`~${RACE_DETAILS_RACE_STATUS}`);
  }

  get raceName() {
    return this.element.$(`~${RACE_DETAILS_NAME}`);
  }

  get distanceAndRaceType() {
    return this.element.$(`~${RACE_DETAILS_PRIMARY_SUBTITLE}`);
  }

  get distance() {
    return this.element.$(`~${RACE_DETAILS_PRIMARY_SUBTITLE_LEFT}`);
  }

  get raceType() {
    return this.element.$(`~${RACE_DETAILS_PRIMARY_SUBTITLE_RIGHT}`);
  }

  get numberOfRunners() {
    return this.element.$(`~${RACE_DETAILS_NUMBER_OF_RUNNERS}`);
  }

  get trackGoing() {
    return this.element.$(`~${RACE_DETAILS_TRACK_GOING}`);
  }

  get raceDetailsMeetingInfo() {
    return this.element.$(`~${RACE_DETAILS_MEETING_INFO}`);
  }

  get meetingFlag() {
    return this.element.$(`~${RACE_DETAILS_MEETING_FLAG}`);
  }

  get meetingName() {
    return this.element.$(`~${RACE_DETAILS_MEETING_NAME}`);
  }

  get meetingTime() {
    return this.element.$(`~${RACE_DETAILS_MEETING_TIME}`);
  }

  get raceInfo() {
    return this.element.$(`~${TEXT_TICKER}`);
  }
}

module.exports = RaceDetailsSO;
