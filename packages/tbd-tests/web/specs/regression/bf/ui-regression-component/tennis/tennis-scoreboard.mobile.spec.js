const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { AvBScoreboardPO, AvBFixturePO, DurationPO, TeamPO, ScorePO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const avbTennisFixturePO = new AvBFixturePO();
const avbTennisScoreboardPO = new AvBScoreboardPO();

const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(avbTennisScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(avbTennisScoreboardPO.awayTeam);

const firstScorePO = new ScorePO(avbTennisScoreboardPO.scores[0]);
const secondScorePO = new ScorePO(avbTennisScoreboardPO.scores[1]);
const thirdScorePO = new ScorePO(avbTennisScoreboardPO.scores[2]);

const mockService = new MockService();

const EVENT_ID = "31111111";

const SURFACE_TYPE = "HARD";

const COMPETITION_NAME = "ATP Australian Open";
const HOME_PLAYER = { name: "Keanu Reeves", rank: 96 };
const AWAY_PLAYER = { name: "Reanu Keeves", rank: 69 };

const SPORT_EVENT = {
  __typename: "SportsEvent",
  name: "Reeves v Keeves",
  openDate: "2077-01-16T20:00:00Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: {
    urn: "ppb:competition:4444",
    name: COMPETITION_NAME,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:2",
      name: "Tennis",
      sportId: 2,
    },
  },
};

const FIXTURE = {
  __typename: "TennisMatch",
  urn: `ppb:fixture:${EVENT_ID}`,
  isAmericanFormat: false,
  runnerNames: {
    home: HOME_PLAYER.name,
    away: AWAY_PLAYER.name,
  },
  scheduledStartTime: "2077-01-16T20:00:00Z",
  matchStatus: { status: "PRE_MATCH", reason: null },
  teamA: {
    side: "HOME",
    players: [HOME_PLAYER],
  },
  teamB: {
    side: "AWAY",
    players: [AWAY_PLAYER],
  },
};

const FIXTURE_AMERICAN_FORMAT = {
  ...FIXTURE,
  isAmericanFormat: true,
};

const BFF_MOCK = {
  __typename: "EventView",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: "Sampras",
        away: "Mcenroe",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE,
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
  ],
};

const BFF_AMERICAN_FORMAT_MOCK = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        home: "Sampras",
        away: "Mcenroe",
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_AMERICAN_FORMAT,
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  match: [
    {
      matchStatus: {
        status: "PRE_MATCH",
        reason: null,
      },
    },
  ],
};

const SCA_IN_RUNNING_MOCK = {
  match: [
    {
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "1",
      teamBScore: "1",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

const SCA_INTERRUPED_MOCK = {
  match: [
    {
      ...SCA_IN_RUNNING_MOCK.match[0],
      matchStatus: {
        status: "INTERRUPTED",
        reason: "RAIN_DELAY",
      },
    },
  ],
};

const SCA_FINISHED_MOCK = {
  match: [
    {
      ...SCA_IN_RUNNING_MOCK.match[0],
      matchStatus: {
        status: "FINISHED",
      },
    },
  ],
};

describe("Tennis Scoreboard", () => {
  describe("when at the event view in a singles match and the tennis match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(avbTennisFixturePO.avbFixtureTitle, COMPETITION_NAME);
    });

    it("[PRPI-7614] should show the competition name", async () => {
      expect(await avbTennisFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
    });

    it("[PRPI-7615] should show the players names and ranks", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe(HOME_PLAYER.name);
      expect(await scoreboardAwayTeamPO.name.getText()).toBe(AWAY_PLAYER.name);
    });

    it("[PRPI-7616] should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Jan 16\n20:00");
    });

    it("[PRPI-7617] should show the game surface type", async () => {
      expect(await avbTennisScoreboardPO.matchInfo.getText()).toBe(SURFACE_TYPE);
    });

    describe("and the tennis match is IN_RUNNING", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(avbTennisFixturePO.avbFixtureTitle, COMPETITION_NAME);
      });

      it("[PRPI-7618] should show the competition name", async () => {
        expect(await avbTennisFixturePO.avbFixtureTitle.getText()).toBe(COMPETITION_NAME);
      });

      it("[PRPI-7619] should show the players names", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe(HOME_PLAYER.name);
        expect(await scoreboardAwayTeamPO.name.getText()).toBe(AWAY_PLAYER.name);
      });

      it("[PRPI-7620] should show the game surface type", async () => {
        expect(await avbTennisScoreboardPO.matchInfo.getText()).toBe(SURFACE_TYPE);
      });

      it("[PRPI-7621] should show the correct scores", async () => {
        expect(await firstScorePO.teamAScore.getText()).toBe("1");
        expect(await secondScorePO.teamAScore.getText()).toBe("15");
        expect(await thirdScorePO.teamAScore.getText()).toBe("15");

        expect(await firstScorePO.teamBScore.getText()).toBe("1");
        expect(await secondScorePO.teamBScore.getText()).toBe("0");
        expect(await thirdScorePO.teamBScore.getText()).toBe("30");
      });

      describe("and the tennis match is INTERRUPTED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_INTERRUPED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(avbTennisScoreboardPO.matchInfo, "RAIN DELAY");
        });

        it("[PRPI-7622] should show the status reason", async () => {
          expect(await avbTennisScoreboardPO.matchInfo.getText()).toBe("RAIN DELAY");
        });

        describe("and the tennis match is FINISHED", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilDisplayed(avbTennisScoreboardPO.matchInfo, "FINISHED");
          });

          it("[PRPI-7623] should show the final score", async () => {
            expect(await firstScorePO.teamAScore.getText()).toBe("1");
            expect(await firstScorePO.teamBScore.getText()).toBe("1");
          });
        });
      });
    });
  });

  describe("when a tennis fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.tickFakeClock(); // we need to tick the fake clock because SCA poller implements a 500ms  debounce when new subscriptions are added
      await browser.waitUntilEquals(firstScorePO.teamAScore, "1");
    });

    it("[PRPI-7624] should show the team names inverted", async () => {
      expect(await scoreboardHomeTeamPO.name.getText()).toBe(AWAY_PLAYER.name);
      expect(await scoreboardAwayTeamPO.name.getText()).toBe(`@ ${HOME_PLAYER.name}`);
    });

    it("[PRPI-7625] should show the team scores inverted", async () => {
      expect(await firstScorePO.teamAScore.getText()).toBe("1");
      expect(await secondScorePO.teamAScore.getText()).toBe("0");
      expect(await thirdScorePO.teamAScore.getText()).toBe("30");

      expect(await firstScorePO.teamBScore.getText()).toBe("1");
      expect(await secondScorePO.teamBScore.getText()).toBe("15");
      expect(await thirdScorePO.teamBScore.getText()).toBe("15");
    });
  });
});
