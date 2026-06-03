const {
  EventPagePO,
  AvBScoreboardPO,
  AvBFixturePO,
  CardPO,
  MarketStatusPO,
  DurationPO,
  TeamPO,
  ScorePO,
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

const AvBTableTennisFixturePO = new AvBFixturePO();
const tableTennisScoreboardPO = new AvBScoreboardPO();
const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(tableTennisScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(tableTennisScoreboardPO.awayTeam);

const firstScorePO = new ScorePO(tableTennisScoreboardPO.scores[0]);
const secondScorePO = new ScorePO(tableTennisScoreboardPO.scores[1]);
const thirdScorePO = new ScorePO(tableTennisScoreboardPO.scores[2]);
const fourthScorePO = new ScorePO(tableTennisScoreboardPO.scores[3]);

const mockService = new MockService();

// Mock fragments
const EVENT_ID = "98765432";

const COMPETITION_NAME = "English Premier League";
const EVENT_NAME = "Jakub Kuzmicz with a really long name v Artur Biatek";
const HOME_TEAM_NAME = "Jakub Kuzmicz with a really long name";
const AWAY_TEAM_NAME = "Artur Biatek";

const RUNNER = {
  runnerURN: "ppb:excRunner:1.160337366/1/0",
};

const SPORT = {
  __typename: "Sport",
  urn: "ppb:eventType:2593174",
  name: "Table Tennis",
  sportId: 2593174,
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
  __typename: "TableTennisFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  currentSet: null,
  previousSets: null,
  setsWon: null,
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
        competition: COMPETITION,
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
        competition: COMPETITION,
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

const ERO_MOCK = [
  {
    state: {
      status: "OPEN",
    },
  },
];

const ERO_INPLAY_MOCK = [
  {
    state: {
      status: "OPEN",
      inplay: true,
    },
  },
];

const ERO_CLOSED_MOCK = [
  {
    state: { status: "CLOSED" },
  },
];

const SCA_MOCK = {
  fixture: [{}],
};

const SCA_IN_RUNNING_MOCK = {
  tableTennisFixture: [
    {
      currentSet: {
        currentServer: "HOME",
        number: 3,
        tableTennisScore: {
          away: 10,
          home: 10,
        },
      },
      previousSets: [
        {
          currentServer: null,
          number: 1,
          tableTennisScore: {
            away: 11,
            home: 8,
          },
        },
        {
          currentServer: null,
          number: 2,
          tableTennisScore: {
            away: 9,
            home: 11,
          },
        },
      ],

      setsWon: {
        away: 1,
        home: 1,
      },
    },
  ],
};

describe("Table Tennis Scoreboard", () => {
  describe("when at the event view in a table tennis match and the table tennis match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms  debounce when new subscriptions are added
      await browser.waitUntilEquals(AvBTableTennisFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-7605] should show the competition name", async () => {
      expect(await AvBTableTennisFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
    });

    it("[PRPI-7606] should show the teams names", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Jakub Kuzmicz with a really long name");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("Artur Biatek");
    });

    it("[PRPI-7607] should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Jan 16\n20:00");
    });

    describe("and the table tennis match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(tableTennisScoreboardPO.teamBScore, "1");
      });

      it("[PRPI-7608] should show the competition name", async () => {
        expect(await AvBTableTennisFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
      });

      it("[PRPI-7609] should show the teams names", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe("Jakub Kuzmicz with a really long name");
        expect(await scoreboardAwayTeamPO.name.getText()).toBe("Artur Biatek");
      });

      it("[PRPI-7610] should show the correct scores", async () => {
        expect(await firstScorePO.teamAScore.getText()).toBe("1");
        expect(await firstScorePO.teamBScore.getText()).toBe("1");

        expect(await secondScorePO.teamAScore.getText()).toBe("8");
        expect(await secondScorePO.teamBScore.getText()).toBe("11");

        expect(await thirdScorePO.teamAScore.getText()).toBe("11");
        expect(await thirdScorePO.teamBScore.getText()).toBe("9");

        expect(await fourthScorePO.teamAScore.getText()).toBe("10");
        expect(await fourthScorePO.teamBScore.getText()).toBe("10");
      });

      describe("and the table tennis match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(ERO_CLOSED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(exchangeMarketStatusPO.label, "CLOSED");
        });

        it("[PRPI-7611] should show the final score", async () => {
          expect(await tableTennisScoreboardPO.teamAScore.getText()).toBe("1");
          expect(await tableTennisScoreboardPO.teamBScore.getText()).toBe("1");
        });
      });
    });
  });

  describe("when a table tennis fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms  debounce when new subscriptions are added
      await browser.waitUntilEquals(firstScorePO.teamAScore, "1");
    });

    it("[PRPI-7612] should show the team names inverted", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Artur Biatek");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("@ Jakub Kuzmicz with a really long name");
    });

    it("[PRPI-7613] should show the team scores inverted", async () => {
      await browser.waitUntilEquals(firstScorePO.teamAScore, "1");

      expect(await firstScorePO.teamBScore.getText()).toBe("1");

      expect(await secondScorePO.teamAScore.getText()).toBe("11");
      expect(await secondScorePO.teamBScore.getText()).toBe("8");

      expect(await thirdScorePO.teamAScore.getText()).toBe("9");
      expect(await thirdScorePO.teamBScore.getText()).toBe("11");

      expect(await fourthScorePO.teamAScore.getText()).toBe("10");
      expect(await fourthScorePO.teamBScore.getText()).toBe("10");
    });
  });
});
