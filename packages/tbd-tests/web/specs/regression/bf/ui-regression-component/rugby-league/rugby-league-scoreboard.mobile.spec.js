const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { AvBScoreboardPO, AvBFixturePO, DurationPO, TeamPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const avbRugbyLeagueFixturePO = new AvBFixturePO();
const rugbyLeagueScoreboardPO = new AvBScoreboardPO();

const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(rugbyLeagueScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(rugbyLeagueScoreboardPO.awayTeam);

const mockService = new MockService();

const EVENT_ID = "56789123";
const COMPETITION_NAME = "Super League";
const HOME_TEAM_NAME = "St Helens";
const AWAY_TEAM_NAME = "Wigan Warriors";

const SPORT_EVENT = {
  __typename: "SportsEvent",
  name: "St Helens v Wigan Warriors",
  openDate: "2077-03-15T19:45:00Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: {
    urn: "ppb:competition:147701",
    name: COMPETITION_NAME,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:1477",
      name: "Rugby League",
      sportId: 1477,
    },
  },
};

const FIXTURE = {
  __typename: "RugbyLeagueFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  isAmericanFormat: false,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  score: null,
  halfTimeScore: null,
};

const FIXTURE_AMERICAN_FORMAT = {
  ...FIXTURE,
  isAmericanFormat: true,
  score: {
    home: 24,
    away: 18,
  },
  halfTimeScore: {
    home: 12,
    away: 6,
  },
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
        home: HOME_TEAM_NAME,
        away: AWAY_TEAM_NAME,
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
        home: HOME_TEAM_NAME,
        away: AWAY_TEAM_NAME,
        sportevent: SPORT_EVENT,
        fixture: FIXTURE_AMERICAN_FORMAT,
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: null,
      halfTimeScore: null,
    },
  ],
};

const SCA_IN_RUNNING_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 24,
        away: 18,
      },
      halfTimeScore: {
        home: 12,
        away: 6,
      },
    },
  ],
};

const SCA_FINISHED_MOCK = {
  rugbyLeagueFixture: [
    {
      id: EVENT_ID,
      score: {
        home: 36,
        away: 24,
      },
      halfTimeScore: {
        home: 12,
        away: 6,
      },
    },
  ],
};

describe("Rugby League Scoreboard", () => {
  describe("when at the event view in a rugby league match and the match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.pause(2000);
    });

    it("[PRPI-5151]should show the competition name", async () => {
      const titleText = await avbRugbyLeagueFixturePO.avbFixtureTitle.getText();
      expect(titleText).toBe(COMPETITION_NAME);
    });

    it("[PRPI-5152]should show the teams names", async () => {
      const homeTeam = await scoreboardHomeTeamPO.name.getText();
      const awayTeam = await scoreboardAwayTeamPO.name.getText();

      expect(homeTeam).toBe(HOME_TEAM_NAME);
      expect(awayTeam).toBe(AWAY_TEAM_NAME);
    });

    it("[PRPI-5153]should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Mar 15\n19:45");
    });

    describe("and the rugby league match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();

        await browser.waitUntilEquals(rugbyLeagueScoreboardPO.teamAScore, "24");
      });

      it("[PRPI-5154]should show the competition name", async () => {
        const titleText = await avbRugbyLeagueFixturePO.avbFixtureTitle.getText();
        expect(titleText).toBe(COMPETITION_NAME);
      });

      it("[PRPI-5155]should show the teams names", async () => {
        const homeTeam = await scoreboardHomeTeamPO.name.getText();
        const awayTeam = await scoreboardAwayTeamPO.name.getText();

        expect(homeTeam).toBe(HOME_TEAM_NAME);
        expect(awayTeam).toBe(AWAY_TEAM_NAME);
      });

      it("[PRPI-5156]should show the correct scores", async () => {
        const teamAScore = await rugbyLeagueScoreboardPO.teamAScore.getText();
        const teamBScore = await rugbyLeagueScoreboardPO.teamBScore.getText();

        expect(teamAScore).toBe("24");
        expect(teamBScore).toBe("18");
      });

      describe("and the rugby league match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(rugbyLeagueScoreboardPO.teamAScore, "36");
        });

        it("[PRPI-5157]should show the final score", async () => {
          const teamAScore = await rugbyLeagueScoreboardPO.teamAScore.getText();
          const teamBScore = await rugbyLeagueScoreboardPO.teamBScore.getText();
          expect(teamAScore).toBe("36");
          expect(teamBScore).toBe("24");
        });
      });
    });
  });

  describe("when a rugby league fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.pause(2000);
      await browser.tickFakeClock();
      await browser.waitUntil(
        async () => {
          const teamAScoreExists = await rugbyLeagueScoreboardPO.teamAScore.isExisting();
          if (!teamAScoreExists) return false;
          const text = await rugbyLeagueScoreboardPO.teamAScore.getText();
          return text === "18";
        },
        { timeout: 5000, timeoutMsg: "Expected teamA score to be 18" },
      );
    });

    it("[PRPI-5158]should show the team names inverted", async () => {
      const homeTeam = await scoreboardHomeTeamPO.name.getText();
      const awayTeam = await scoreboardAwayTeamPO.name.getText();
      expect(homeTeam).toBe(AWAY_TEAM_NAME);
      expect(awayTeam).toBe(`@ ${HOME_TEAM_NAME}`);
    });

    it("[PRPI-5159]should show the team scores inverted", async () => {
      const teamAScore = await rugbyLeagueScoreboardPO.teamAScore.getText();
      const teamBScore = await rugbyLeagueScoreboardPO.teamBScore.getText();
      expect(teamAScore).toBe("18");
      expect(teamBScore).toBe("24");
    });
  });
});
