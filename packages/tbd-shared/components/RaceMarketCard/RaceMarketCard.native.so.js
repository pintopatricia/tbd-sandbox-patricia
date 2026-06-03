const {
  RACE_DETAILS_MEETING_INFO,
  RACE_DETAILS_MEETING_FLAG,
  RACE_DETAILS_RACE_STATUS,
  RACE_DETAILS_MEETING_TIME,
  RACE_DETAILS_MEETING_NAME,
} = require("@ppb/the-wall-native/components/RaceDetails/RaceDetails.selectors");
const {
  HORSE_RUNNER,
} = require("@ppb/the-wall-native/components/Runner/HorseRacingRunner/HorseRacingRunner.selectors");

const { TAB_TITLE } = require("@ppb/the-wall-native/components/TabsGroup/TabsGroupTitle/TabsGroupTitle.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { RACE_MARKET_CARD, RACE_DETAILS_CONTAINER } = require("./RaceMarketCard.native.selectors");

/**
 * Class that represents the Race Market Card SO
 *
 */
class RaceMarketCardSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RACE_MARKET_CARD}`));
  }

  get detailsContainer() {
    return this.element.$(`~${RACE_DETAILS_CONTAINER}`);
  }

  get meetingFlag() {
    return this.element.$(`~${RACE_DETAILS_MEETING_FLAG}`);
  }

  get meetingInfo() {
    return this.element.$(`~${RACE_DETAILS_MEETING_INFO}`);
  }

  get meetingTime() {
    return this.element.$(`~${RACE_DETAILS_MEETING_TIME}`);
  }

  get meetingName() {
    return this.element.$(`~${RACE_DETAILS_MEETING_NAME}`);
  }

  get status() {
    return this.element.$(`~${RACE_DETAILS_RACE_STATUS}`);
  }

  get tabsTitle() {
    return this.element.$$(`~${TAB_TITLE}`);
  }

  get runners() {
    return this.element.$$(`~${HORSE_RUNNER}`);
  }
}

module.exports = RaceMarketCardSO;
