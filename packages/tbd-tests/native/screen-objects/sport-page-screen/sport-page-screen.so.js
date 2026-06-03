const {
  SECONDARY_EVENT_CARD,
  START_TIME_SELECTOR,
  RUNNER_HOME_NAME,
  RUNNER_AWAY_NAME,
} = require("@ppb/tbd-shared/components/EventViewLinkCard/snowflakes/SecondaryEventCard/SecondaryEventCard.native.selectors");
const { TEAM } = require("@ppb/the-wall-native/components/Scoreboard/Team/Team.selectors");
const {
  RACE_VIEW_LINK_CARD,
} = require("@ppb/tbd-shared/components/RaceViewLinkCard/snowflakes/RaceViewLinkCard/RaceViewLinkCard.native.selectors");
const { PAGE_HEADER_TITLE } = require("@ppb/the-wall-native/components/PageHeader/PageHeader.selectors");
const { EVENT_MARKET_CARD } = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.native.selectors");
const { PEBBLE_CARDGROUP } = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { GENERIC_SCREEN } = require("../generic/generic.selectors");

class SportPageScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GENERIC_SCREEN}`));
  }

  get title() {
    return this.element.$(`~${PAGE_HEADER_TITLE}`);
  }

  get eventMarketCards() {
    return this.element.$$(`~${EVENT_MARKET_CARD}`);
  }

  get footballTeamNames() {
    return this.element.$$(`~${TEAM}`);
  }

  get secondaryEventCards() {
    return this.element.$$(`~${SECONDARY_EVENT_CARD}`);
  }

  get startTime() {
    return this.element.$$(`~${START_TIME_SELECTOR}`);
  }

  get homeName() {
    return this.element.$$(`~${RUNNER_HOME_NAME}`);
  }

  get awayName() {
    return this.element.$$(`~${RUNNER_AWAY_NAME}`);
  }

  get raceViewLinkCards() {
    return this.element.$$(`~${RACE_VIEW_LINK_CARD}`);
  }

  get pebbleCardGroups() {
    return this.element.$$(`~${PEBBLE_CARDGROUP}`);
  }
}

module.exports = SportPageScreenSO;
