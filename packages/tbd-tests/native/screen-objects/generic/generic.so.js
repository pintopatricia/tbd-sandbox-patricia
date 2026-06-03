const { CARD } = require("@ppb/the-wall-native/components/Card/Card.selectors");
const {
  PROMOTION_CARD,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/PromotionCard/PromotionCard.native.selectors");
const {
  CASINO_PROMOTION_CARD,
} = require("@ppb/tbd-shared/components/PromotionCard/snowflakes/CasinoPromotionCard/CasinoPromotionCard.native.selectors");
const {
  TAB_LABEL_CONTAINER,
} = require("@ppb/the-wall-native/components/TabsGroup/NavigationTabLabel/NavigationTabLabel.selectors");
const { PAGE_HEADER_TITLE } = require("@ppb/the-wall-native/components/PageHeader/PageHeader.selectors");
const { TENNIS_FIXTURE } = require("@ppb/tbd-shared/components/TennisFixture/TennisFixture.native.selectors");
const {
  BASKETBALL_FIXTURE,
} = require("@ppb/tbd-shared/components/BasketballFixture/BasketballFixture.native.selectors");
const { CRICKET_FIXTURE } = require("@ppb/tbd-shared/components/CricketFixture/CricketFixture.native.selectors");
const {
  TABLE_TENNIS_FIXTURE,
} = require("@ppb/tbd-shared/components/TableTennisFixture/TableTennisFixture.native.selectors");
const {
  RUGBY_UNION_FIXTURE,
} = require("@ppb/tbd-shared/components/RugbyUnionFixture/RugbyUnionFixture.native.selectors");
const { ICE_HOCKEY_FIXTURE } = require("@ppb/tbd-shared/components/IceHockeyFixture/IceHockeyFixture.native.selectors");
const {
  RUGBY_LEAGUE_FIXTURE,
} = require("@ppb/tbd-shared/components/RugbyLeagueFixture/RugbyLeagueFixture.native.selectors");
const { SNOOKER_FIXTURE } = require("@ppb/tbd-shared/components/SnookerFixture/SnookerFixture.native.selectors");
const {
  VOLLEYBALL_FIXTURE,
} = require("@ppb/tbd-shared/components/VolleyballFixture/VolleyballFixture.native.selectors");
const { BaseSO } = require("@ppb/wdio-lazy-element");
const { GENERIC_SCREEN, GENERIC_PLACEHOLDER } = require("./generic.selectors");

class GenericScreenSO extends BaseSO {
  constructor(lazyElement) {
    super(lazyElement, $(`~${GENERIC_SCREEN}`));
  }

  get cards() {
    return this.element.$$(`~${CARD}`);
  }

  get placeholder() {
    return this.element.$(`~${GENERIC_PLACEHOLDER}`);
  }

  get title() {
    return this.element.$(`~${PAGE_HEADER_TITLE}`);
  }

  get promotionCards() {
    return this.element.$$(`~${PROMOTION_CARD}`);
  }

  get casinoPromotionCards() {
    return this.element.$$(`~${CASINO_PROMOTION_CARD}`);
  }

  get sportsRibbon() {
    return this.element.$$(`~${TAB_LABEL_CONTAINER}`);
  }

  get tennisFixtures() {
    return this.element.$$(`~${TENNIS_FIXTURE}`);
  }

  get basketballFixtures() {
    return this.element.$$(`~${BASKETBALL_FIXTURE}`);
  }

  get cricketFixtures() {
    return this.element.$$(`~${CRICKET_FIXTURE}`);
  }

  get tableTennisFixtures() {
    return this.element.$$(`~${TABLE_TENNIS_FIXTURE}`);
  }

  get rugbyUnionFixtures() {
    return this.element.$$(`~${RUGBY_UNION_FIXTURE}`);
  }

  get iceHockeyFixtures() {
    return this.element.$$(`~${ICE_HOCKEY_FIXTURE}`);
  }

  get rugbyLeagueFixtures() {
    return this.element.$$(`~${RUGBY_LEAGUE_FIXTURE}`);
  }

  get snookerFixtures() {
    return this.element.$$(`~${SNOOKER_FIXTURE}`);
  }

  get volleyballFixtures() {
    return this.element.$$(`~${VOLLEYBALL_FIXTURE}`);
  }
}

module.exports = GenericScreenSO;
