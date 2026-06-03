const {
  RACE_TIME_CONTAINER,
  RACE_TIME_TEXT_SELECTED,
  ICON_CONTAINER,
  RACE_TIME_TEXT,
  RACE_TIME_MEETING_NAME,
  PROMO_ICON_CONTAINER,
} = require("@ppb/the-wall-native/components/RaceTime/RaceTime.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RaceTimeSO extends BaseSO {
  get races() {
    return this.element.$$(`~${RACE_TIME_CONTAINER}`);
  }

  get selectedRace() {
    return this.element.$(`~${RACE_TIME_TEXT_SELECTED}`);
  }

  get iconContainer() {
    return this.element.$(`~${ICON_CONTAINER}`);
  }

  get raceTimeText() {
    return this.element.$(`~${RACE_TIME_TEXT}`);
  }

  get meetingName() {
    return this.element.$(`~${RACE_TIME_MEETING_NAME}`);
  }

  get promoIconContainer() {
    return this.element.$(`~${PROMO_ICON_CONTAINER}`);
  }
}

module.exports = RaceTimeSO;
