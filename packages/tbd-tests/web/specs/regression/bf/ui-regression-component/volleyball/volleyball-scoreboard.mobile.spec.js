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

const AvBVolleyballFixturePO = new AvBFixturePO();
const volleyballScoreboardPO = new AvBScoreboardPO();
const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(volleyballScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(volleyballScoreboardPO.awayTeam);

const firstScorePO = new ScorePO(volleyballScoreboardPO.scores[0]);
const secondScorePO = new ScorePO(volleyballScoreboardPO.scores[1]);
const thirdScorePO = new ScorePO(volleyballScoreboardPO.scores[2]);
const fourthScorePO = new ScorePO(volleyballScoreboardPO.scores[3]);

const mockService = new MockService();

// Mock fragments
const EVENT_ID = "88888888";

const COMPETITION_NAME = "World Championship";
const EVENT_NAME = "Brazil v USA";
const HOME_TEAM_NAME = "Brazil";
const AWAY_TEAM_NAME = "USA";

const RUNNER = {
  runnerURN: "ppb:excRunner:1.160337366/1/0",
};

const SPORT = {
  __typename: "Sport",
  urn: "ppb:eventType:998917",
  name: "Volleyball",
  sportId: 998917,
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
  __typename: "VolleyballFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  currentSet: null,
  previousSets: null,
  homeScore: null,
  awayScore: null,
  isAmericanFormat: false,
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
  volleyballFixture: [
    {
      id: EVENT_ID,
      currentSet: {
        currentServer: "HOME",
        number: 3,
        score: {
          away: 20,
          home: 22,
        },
      },
      previousSets: [
        {
          currentServer: null,
          number: 1,
          score: {
            away: 25,
            home: 23,
          },
        },
        {
          currentServer: null,
          number: 2,
          score: {
            away: 20,
            home: 25,
          },
        },
      ],

      homeScore: 1,
      awayScore: 1,
    },
  ],
};

describe("Volleyball Scoreboard", () => {
  describe("when at the event view in a volleyball match and the volleyball match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added
      await browser.waitUntilEquals(AvBVolleyballFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-5160]should show the competition name", async () => {
      expect(await AvBVolleyballFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
    });

    it("[PRPI-5161]should show the teams names", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("Brazil");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("USA");
    });

    it("[PRPI-5162]should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Jan 16\n20:00");
    });

    describe("and the volleyball match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(volleyballScoreboardPO.teamBScore, "1");
      });

      it("[PRPI-5163]should show the competition name", async () => {
        expect(await AvBVolleyballFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
      });

      it("[PRPI-5164]should show the teams names", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe("Brazil");
        expect(await scoreboardAwayTeamPO.name.getText()).toBe("USA");
      });

      it("[PRPI-5165]should show the correct scores", async () => {
        // Sets won (first column)
        expect(await firstScorePO.teamAScore.getText()).toBe("1");
        expect(await firstScorePO.teamBScore.getText()).toBe("1");

        // First set (second column)
        expect(await secondScorePO.teamAScore.getText()).toBe("23");
        expect(await secondScorePO.teamBScore.getText()).toBe("25");

        // Second set (third column)
        expect(await thirdScorePO.teamAScore.getText()).toBe("25");
        expect(await thirdScorePO.teamBScore.getText()).toBe("20");

        // Current set (fourth column)
        expect(await fourthScorePO.teamAScore.getText()).toBe("22");
        expect(await fourthScorePO.teamBScore.getText()).toBe("20");
      });

      describe("and the volleyball match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(ERO_CLOSED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(exchangeMarketStatusPO.label, "CLOSED");
        });

        it("[PRPI-5166]should show the final score", async () => {
          expect(await volleyballScoreboardPO.teamAScore.getText()).toBe("1");
          expect(await volleyballScoreboardPO.teamBScore.getText()).toBe("1");
        });
      });
    });
  });

  describe("when a volleyball fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_INPLAY_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms debounce when new subscriptions are added
      await browser.waitUntilEquals(firstScorePO.teamAScore, "1");
    });

    it("[PRPI-5167]should show the team names inverted", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe("USA");
      expect(await scoreboardAwayTeamPO.name.getText()).toBe("@ Brazil");
    });

    it("[PRPI-5168]should show the team scores inverted", async () => {
      await browser.waitUntilEquals(firstScorePO.teamAScore, "1");

      expect(await firstScorePO.teamBScore.getText()).toBe("1");

      expect(await secondScorePO.teamAScore.getText()).toBe("25");
      expect(await secondScorePO.teamBScore.getText()).toBe("23");

      expect(await thirdScorePO.teamAScore.getText()).toBe("20");
      expect(await thirdScorePO.teamBScore.getText()).toBe("25");

      expect(await fourthScorePO.teamAScore.getText()).toBe("20");
      expect(await fourthScorePO.teamBScore.getText()).toBe("22");
    });
  });
});
