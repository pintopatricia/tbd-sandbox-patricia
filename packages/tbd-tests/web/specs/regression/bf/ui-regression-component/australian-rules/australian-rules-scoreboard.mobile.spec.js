const {
  EventPagePO,
  AvBScoreboardPO,
  AvBFixturePO,
  CardPO,
  MarketStatusPO,
  DurationPO,
  TeamPO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketStatusPO = new MarketStatusPO(firstCardPO.exchangeMarket);

const AvBAustralianRulesFixturePO = new AvBFixturePO();
const australianRulesScoreboardPO = new AvBScoreboardPO();
const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(australianRulesScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(australianRulesScoreboardPO.awayTeam);

const mockService = new MockService();

// Mock fragments
const EVENT_ID = "34967318";
const COMPETITION_NAME = "NTFL";
const EVENT_NAME = "Utah Mammoth v Anaheim Ducks";
const HOME_TEAM_NAME = "Utah Mammoth";
const AWAY_TEAM_NAME = "Anaheim Ducks";

const RUNNER = {
  runnerURN: "ppb:excRunner:1.160337366/1/0",
};

const SPORT = {
  __typename: "Sport",
  urn: "ppb:eventType:61420",
  name: "Australian Rules",
  sportId: 61420,
};

const COMPETITION = {
  urn: "ppb:competition:12345",
  name: COMPETITION_NAME,
  sport: SPORT,
};

const SPORT_EVENT = {
  __typename: "SportsEvent",
  eventName: EVENT_NAME,
  name: EVENT_NAME,
  openDate: "2077-01-16T20:00:00Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: COMPETITION,
};

const FIXTURE = {
  __typename: "AustralianRulesFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  isAmericanFormat: true,
  score: null,
};

const FIXTURE_AMERICAN_FORMAT = {
  ...FIXTURE,
  isAmericanFormat: true,
};

// Mocks
const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: HOME_TEAM_NAME,
        away: AWAY_TEAM_NAME,
        sportevent: SPORT_EVENT,
        fixture: FIXTURE,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE,
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: SPORT_EVENT,
                competition: COMPETITION,
              },
              runners: [RUNNER, RUNNER],
            },
            runners: [RUNNER, RUNNER],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        __typename: "MarketCard",
      },
    },
  ],
};

const BFF_AMERICAN_FORMAT_MOCK = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: HOME_TEAM_NAME,
        away: AWAY_TEAM_NAME,
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_AMERICAN_FORMAT,
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_AMERICAN_FORMAT,
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                sportevent: SPORT_EVENT,
                competition: COMPETITION,
              },
              runners: [RUNNER, RUNNER],
            },
            runners: [RUNNER, RUNNER],
          },
        },
      },
    },
  ],
};

const SCA_MOCK = {
  australianRulesFixture: [{}],
};

const SCA_IN_RUNNING_MOCK = {
  australianRulesFixture: [
    {
      id: EVENT_ID,
      periodScores: [
        {
          score: {
            points: {
              home: 3,
              away: 2,
            },
          },
          period: "PERIOD_1",
        },
      ],

      score: {
        points: {
          home: 3,
          away: 2,
        },
      },
    },
  ],
};

const ERO_CLOSED_MARKET_MOCK = [
  {
    state: { status: "CLOSED" },
  },
];

const ERO_MOCK = [{}];

const ERO_INPLAY_MOCK = [
  {
    state: { inplay: true },
  },
];

describe("Australian Rules Scoreboard", () => {
  describe("when at the event view in a australian rules match and the australian rules match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(AvBAustralianRulesFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-5657] should show the competition name", async () => {
      expect(await AvBAustralianRulesFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
    });

    it("[PRPI-5658] should show the teams names", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Anaheim Ducks");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("@ Utah Mammoth");
    });

    it("[PRPI-5659] should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Jan 16\n20:00");
    });

    describe("and the australian rules match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(australianRulesScoreboardPO.teamBScore, "3");
      });

      it("[PRPI-5660] should show the competition name", async () => {
        expect(await AvBAustralianRulesFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
      });

      it("[PRPI-5661] should show the teams names", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe("Anaheim Ducks");
      });

      it("[PRPI-5662] should show the correct scores", async () => {
        expect(await australianRulesScoreboardPO.teamAScore.getText()).toBe("2");
        expect(await australianRulesScoreboardPO.teamBScore.getText()).toBe("3");
      });

      describe("and the australian rules match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(ERO_CLOSED_MARKET_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(exchangeMarketStatusPO.label, "CLOSED");
        });

        it("[PRPI-5663] should show the final score", async () => {
          expect(await australianRulesScoreboardPO.teamAScore.getText()).toBe("2");
          expect(await australianRulesScoreboardPO.teamBScore.getText()).toBe("3");
        });
      });
    });
  });

  describe("when a australian rules fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(AvBAustralianRulesFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-5664] should show the team names inverted", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Anaheim Ducks");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("@ Utah Mammoth");
    });

    it("[PRPI-5665] should show the team scores inverted", async () => {
      expect(await australianRulesScoreboardPO.teamAScore.getText()).toBe("2");
      expect(await australianRulesScoreboardPO.teamBScore.getText()).toBe("3");
    });
  });
});
