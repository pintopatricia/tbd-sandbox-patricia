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

const AvBIceHockeyFixturePO = new AvBFixturePO();
const iceHockeyScoreboardPO = new AvBScoreboardPO();
const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(iceHockeyScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(iceHockeyScoreboardPO.awayTeam);

const mockService = new MockService();

// Mock fragments
const EVENT_ID = "34967318";
const COMPETITION_NAME = "English Premier League";
const EVENT_NAME = "Utah Mammoth v Anaheim Ducks";
const HOME_TEAM_NAME = "Utah Mammoth";
const AWAY_TEAM_NAME = "Anaheim Ducks";

const RUNNER = {
  runnerURN: "ppb:excRunner:1.160337366/1/0",
};

const SPORT = {
  __typename: "Sport",
  urn: "ppb:eventType:7524",
  name: "Ice Hockey",
  sportId: 7524,
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
  __typename: "IceHockeyFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  periodClock: "PERIOD_1",
  isAmericanFormat: false,
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
  iceHockeyFixture: [{}],
};

const SCA_IN_RUNNING_MOCK = {
  iceHockeyFixture: [
    {
      id: EVENT_ID,
      periodClock: "END_PERIOD_1",
      periodScores: [
        {
          score: { home: 3, away: 2 },
          period: "PERIOD_1",
        },
      ],

      homeScore: 3,
      awayScore: 2,
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

describe("Ice Hockey Scoreboard", () => {
  describe("when at the event view in a ice hockey match and the ice hockey match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(AvBIceHockeyFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-5955] should show the competition name", async () => {
      expect(await AvBIceHockeyFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
    });

    it("[PRPI-5956] should show the teams names", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Utah Mammoth");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("Anaheim Ducks");
    });

    it("[PRPI-5957] should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Jan 16\n20:00");
    });

    describe("and the ice hockey match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(iceHockeyScoreboardPO.teamBScore, "2");
      });

      it("[PRPI-5958] should show the competition name", async () => {
        expect(await AvBIceHockeyFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
      });

      it("[PRPI-5959] should show the teams names", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe("Utah Mammoth");
        expect(await scoreboardAwayTeamPO.name.getText()).toBe("Anaheim Ducks");
      });

      it("[PRPI-5960] should show the correct scores", async () => {
        expect(await iceHockeyScoreboardPO.teamAScore.getText()).toBe("3");
        expect(await iceHockeyScoreboardPO.teamBScore.getText()).toBe("2");
      });

      describe("and the ice hockey match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(ERO_CLOSED_MARKET_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(exchangeMarketStatusPO.label, "CLOSED");
        });

        it("[PRPI-5961] should show the final score", async () => {
          expect(await iceHockeyScoreboardPO.teamAScore.getText()).toBe("3");
          expect(await iceHockeyScoreboardPO.teamBScore.getText()).toBe("2");
        });
      });
    });
  });

  describe("when a ice hockey fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(AvBIceHockeyFixturePO.avbFixtureTitle, COMPETITION_NAME);
      await browser.waitUntilEquals(iceHockeyScoreboardPO.teamBScore, "3");
    });

    it("[PRPI-5962] should show the team names inverted", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Anaheim Ducks");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("@ Utah Mammoth");
    });

    it("[PRPI-5963] should show the team scores inverted", async () => {
      expect(await iceHockeyScoreboardPO.teamAScore.getText()).toBe("2");
      expect(await iceHockeyScoreboardPO.teamBScore.getText()).toBe("3");
    });
  });
});
