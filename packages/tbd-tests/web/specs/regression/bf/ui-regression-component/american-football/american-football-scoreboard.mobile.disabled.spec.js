const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { AvBScoreboardPO, AvBFixturePO, DurationPO, TeamPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const avbAmericanFootballFixturePO = new AvBFixturePO();
const americanFootballScoreboardPO = new AvBScoreboardPO();

const scoreboardDurationPO = new DurationPO();

const scoreboardHomeTeamPO = new TeamPO(americanFootballScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(americanFootballScoreboardPO.awayTeam);

const mockService = new MockService();

const EVENT_ID = "45617892";
const COMPETITION_NAME = "NFL";
const HOME_TEAM_NAME = "Kansas City Chiefs";
const AWAY_TEAM_NAME = "Philadelphia Eagles";

const SPORT_EVENT = {
  __typename: "SportsEvent",
  name: "Kansas City Chiefs v Philadelphia Eagles",
  openDate: "2077-02-12T23:30:00Z",
  urn: `ppb:event:${EVENT_ID}`,
  competition: {
    urn: "ppb:competition:161001",
    name: COMPETITION_NAME,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:16",
      name: "American Football",
      sportId: 16,
    },
  },
};

const FIXTURE = {
  __typename: "AmericanFootballFixture",
  urn: `ppb:fixture:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  isAmericanFormat: false,
  runnerNames: {
    home: HOME_TEAM_NAME,
    away: AWAY_TEAM_NAME,
  },
  score: null,
  clock: null,
  quarterScores: null,
};

const FIXTURE_AMERICAN_FORMAT = {
  ...FIXTURE,
  isAmericanFormat: true,
  score: {
    home: 14,
    away: 21,
  },
  clock: {
    americanFootballPeriod: "PERIOD_2",
  },
  quarterScores: [
    {
      period: "PERIOD_1",
      score: {
        home: 7,
        away: 14,
      },
    },
    {
      period: "PERIOD_2",
      score: {
        home: 7,
        away: 7,
      },
    },
  ],
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
  americanFootballFixture: [
    {
      id: EVENT_ID,
      score: null,
      clock: null,
    },
  ],
};

const SCA_IN_RUNNING_MOCK = {
  americanFootballFixture: [
    {
      id: EVENT_ID,
      clock: {
        period: "PERIOD_2",
      },
      score: {
        home: 14,
        away: 21,
      },
      quarterScores: [
        {
          period: "PERIOD_1",
          score: {
            home: 7,
            away: 14,
          },
        },
        {
          period: "PERIOD_2",
          score: {
            home: 7,
            away: 7,
          },
        },
      ],
    },
  ],
};

const SCA_FINISHED_MOCK = {
  americanFootballFixture: [
    {
      id: EVENT_ID,
      clock: {
        period: "END",
      },
      score: {
        home: 28,
        away: 35,
      },
      quarterScores: [
        {
          period: "PERIOD_1",
          score: {
            home: 7,
            away: 14,
          },
        },
        {
          period: "PERIOD_2",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "PERIOD_3",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "PERIOD_4",
          score: {
            home: 7,
            away: 7,
          },
        },
      ],
    },
  ],
};

const SCA_OVERTIME_MOCK = {
  americanFootballFixture: [
    {
      id: EVENT_ID,
      clock: {
        period: "OVERTIME",
      },
      score: {
        home: 31,
        away: 28,
      },
      quarterScores: [
        {
          period: "PERIOD_1",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "PERIOD_2",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "PERIOD_3",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "PERIOD_4",
          score: {
            home: 7,
            away: 7,
          },
        },
        {
          period: "OVERTIME",
          score: {
            home: 3,
            away: 0,
          },
        },
      ],
    },
  ],
};

xdescribe("American Football Scoreboard", () => {
  describe("when at the event view in an american football match and the match is in PRE_MATCH", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.pause(2000);
    });

    it("[PRPI-5090]should show the competition name", async () => {
      const titleText = await avbAmericanFootballFixturePO.avbFixtureTitle.getText();
      expect(titleText).toBe(COMPETITION_NAME);
    });

    it("[PRPI-5091]should show the teams names", async () => {
      const homeTeam = await scoreboardHomeTeamPO.name.getText();
      const awayTeam = await scoreboardAwayTeamPO.name.getText();

      expect(homeTeam).toBe(HOME_TEAM_NAME);
      expect(awayTeam).toBe(AWAY_TEAM_NAME);
    });

    it("[PRPI-5092]should show the game starting time", async () => {
      expect(await scoreboardDurationPO.datetime.getText()).toBe("Feb 12\n23:30");
    });

    describe("and the american football match is IN_PLAY", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));
        await browser.tickFakeClock();

        await browser.waitUntilEquals(americanFootballScoreboardPO.teamBScore, "21");
      });

      it("[PRPI-5093]should show the competition name", async () => {
        const titleText = await avbAmericanFootballFixturePO.avbFixtureTitle.getText();
        expect(titleText).toBe(COMPETITION_NAME);
      });

      it("[PRPI-5094]should show the teams names", async () => {
        const homeTeam = await scoreboardHomeTeamPO.name.getText();
        const awayTeam = await scoreboardAwayTeamPO.name.getText();

        expect(homeTeam).toBe(HOME_TEAM_NAME);
        expect(awayTeam).toBe(AWAY_TEAM_NAME);
      });

      it("[PRPI-5095]should show the correct scores", async () => {
        const teamAScore = await americanFootballScoreboardPO.teamAScore.getText();
        const teamBScore = await americanFootballScoreboardPO.teamBScore.getText();

        expect(teamAScore).toBe("14");
        expect(teamBScore).toBe("21");
      });

      it("[PRPI-5096]should show the current period", async () => {
        const statusElement = await americanFootballScoreboardPO.element.$('[class*="status"]');
        const statusText = await statusElement.getText();

        expect(statusText).toBe("Q2");
      });

      describe("and the american football match is FINISHED", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_FINISHED_MOCK));
          await browser.tickFakeClock();
          const statusElement = await americanFootballScoreboardPO.element.$('[class*="status"]');
          await browser.waitUntil(
            async () => {
              const text = await statusElement.getText();
              return text === "FT";
            },
            { timeout: 5000, timeoutMsg: "Expected status to be FT" },
          );
        });

        it("[PRPI-5097]should show the final score", async () => {
          const teamAScore = await americanFootballScoreboardPO.teamAScore.getText();
          const teamBScore = await americanFootballScoreboardPO.teamBScore.getText();
          expect(teamAScore).toBe("28");
          expect(teamBScore).toBe("35");
        });

        it("[PRPI-5098]should show final period status", async () => {
          const statusElement = await americanFootballScoreboardPO.element.$('[class*="status"]');
          const statusText = await statusElement.getText();
          expect(statusText).toBe("FT");
        });
      });
    });

    describe("when an american football match has overtime", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_OVERTIME_MOCK));
        await browser.tickFakeClock();

        await browser.waitUntilEquals(americanFootballScoreboardPO.teamAScore, "31");

        const statusElement = await americanFootballScoreboardPO.element.$('[class*="status"]');
        await browser.waitUntil(
          async () => {
            const text = await statusElement.getText();
            return text === "OT";
          },
          { timeout: 5000, timeoutMsg: "Expected status to be OT" },
        );
      });

      it("[PRPI-5099]should show the overtime period", async () => {
        const statusElement = await americanFootballScoreboardPO.element.$('[class*="status"]');
        const statusText = await statusElement.getText();
        expect(statusText).toBe("OT");
      });

      it("[PRPI-5100]should show the correct scores including overtime", async () => {
        expect(await americanFootballScoreboardPO.teamAScore.getText()).toBe("31");
        expect(await americanFootballScoreboardPO.teamBScore.getText()).toBe("28");
      });
    });
  });

  describe("when an american football fixture is in american format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_AMERICAN_FORMAT_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_AMERICAN_FORMAT_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_IN_RUNNING_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.pause(2000);

      await browser.waitUntil(
        async () => {
          const teamAScoreExists = await americanFootballScoreboardPO.teamAScore.isExisting();
          return teamAScoreExists;
        },
        { timeout: 5000, timeoutMsg: "Expected teamAScore element to exist" },
      );

      await browser.tickFakeClock();
      await browser.pause(500);

      await browser.waitUntilEquals(americanFootballScoreboardPO.teamAScore, "21");
    });

    it("[PRPI-5101]should show the team names inverted", async () => {
      const homeTeam = await scoreboardHomeTeamPO.name.getText();
      const awayTeam = await scoreboardAwayTeamPO.name.getText();
      expect(homeTeam).toBe(AWAY_TEAM_NAME);
      expect(awayTeam).toBe(`@ ${HOME_TEAM_NAME}`);
    });

    it("[PRPI-5102]should show the team scores inverted", async () => {
      const teamAScore = await americanFootballScoreboardPO.teamAScore.getText();
      const teamBScore = await americanFootballScoreboardPO.teamBScore.getText();
      expect(teamAScore).toBe("21");
      expect(teamBScore).toBe("14");
    });
  });
});
