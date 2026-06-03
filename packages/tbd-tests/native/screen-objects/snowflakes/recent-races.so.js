const { ACTION_LINK, ACTION_LINK_TEXT } = require("@ppb/the-wall-native/components/ActionLink/ActionLink.selectors");
const {
  RECENT_RACES,
  RECENT_RACES_TITLE,
  RECENT_RACES_INFO_HEADERS,
  RECENT_RACES_INFO_ROW_DATE,
  RECENT_RACES_INFO_ROW_COURSE,
  RECENT_RACES_INFO_ROW_DISTANCE,
  RECENT_RACES_INFO_ROW_GOING,
  RECENT_RACES_INFO_ROW_POS,
  RECENT_RACES_INFO_ROW_TYPE,
  RECENT_RACES_INFO_ROW_COMMENT,
  RECENT_RACES_INFO_ROW,
} = require("@ppb/the-wall-native/components/RecentRaces/RecentRaces.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");

class RecentRacesSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${RECENT_RACES}`));
  }

  get title() {
    return this.element.$(`~${RECENT_RACES_TITLE}`);
  }

  get showButton() {
    return this.element.$(`~${ACTION_LINK}`);
  }

  get showButtonText() {
    return this.element.$(`~${ACTION_LINK_TEXT}`);
  }

  get headers() {
    return this.element.$$(`~${RECENT_RACES_INFO_HEADERS}`);
  }

  get raceInfoRows() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW}`);
  }

  get raceInfoDate() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_DATE}`);
  }

  get raceInfoCourse() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_COURSE}`);
  }

  get raceInfoDistance() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_DISTANCE}`);
  }

  get raceInfoGoing() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_GOING}`);
  }

  get raceInfoPos() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_POS}`);
  }

  get raceInfoType() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_TYPE}`);
  }

  get raceInfoComment() {
    return this.element.$$(`~${RECENT_RACES_INFO_ROW_COMMENT}`);
  }
}

module.exports = RecentRacesSO;
