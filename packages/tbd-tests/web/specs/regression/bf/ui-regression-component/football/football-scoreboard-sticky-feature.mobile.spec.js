const {
  EventPagePO,
  AppPO,
  CardPO,
  ExchangeMarketPO,
  RunnerPO,
  AvBFixturePO,
  FootballScoreboardPO,
  TeamPO,
  DurationPO,
  PenaltiesPO,
  ScorePO,
} = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const appPO = new AppPO();
const avbFixturePO = new AvBFixturePO();
const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const marketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const lastRunnerPO = new RunnerPO(marketPO.runnerList[8]);
const footballScoreboardPO = new FootballScoreboardPO();
const scoreboardScorePO = new ScorePO();
const scoreboardDurationPO = new DurationPO();
const footballScoreboardPenaltiesPO = new PenaltiesPO();
const scoreboardHomeTeamPO = new TeamPO(footballScoreboardPO.homeTeam);
const scoreboardAwayTeamPO = new TeamPO(footballScoreboardPO.awayTeam);
const footballScoreboardHomePenaltiesPO = new PenaltiesPO(footballScoreboardPenaltiesPO.homeKicks);
const footballScoreboardAwayPenaltiesPO = new PenaltiesPO(footballScoreboardPenaltiesPO.awayKicks);
const stickyFixtureHeaderPO = new FootballScoreboardPO(appPO.stickyHeader);

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  nextPageCursor: "nextCursor",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        away: "Portugal",
        home: "Ukraine",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture:29465861",
        fixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Ukraine",
            color: "091453",
          },
          away: {
            name: "Portugal",
            color: "FC5002",
          },
          scheduledAt: "2010-10-14T18:45Z",
          duration: {},
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29436223:CORRECT_SCORE",
        title: "Correct Score",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337366",
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337366/1/0",
                  selectionId: 1,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/2/0",
                  selectionId: 2,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/3/0",
                  selectionId: 3,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/4/0",
                  selectionId: 4,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/5/0",
                  selectionId: 5,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/6/0",
                  selectionId: 6,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/7/0",
                  selectionId: 7,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/8/0",
                  selectionId: 8,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/9/0",
                  selectionId: 9,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/10/0",
                  selectionId: 10,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/11/0",
                  selectionId: 11,
                },
                {
                  runnerURN: "ppb:excRunner:1.160337366/12/0",
                  selectionId: 12,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337366/1/0" },
              { runnerURN: "ppb:excRunner:1.160337366/2/0" },
              { runnerURN: "ppb:excRunner:1.160337366/3/0" },
              { runnerURN: "ppb:excRunner:1.160337366/4/0" },
              { runnerURN: "ppb:excRunner:1.160337366/5/0" },
              { runnerURN: "ppb:excRunner:1.160337366/6/0" },
              { runnerURN: "ppb:excRunner:1.160337366/7/0" },
              { runnerURN: "ppb:excRunner:1.160337366/8/0" },
              { runnerURN: "ppb:excRunner:1.160337366/9/0" },
              { runnerURN: "ppb:excRunner:1.160337366/10/0" },
              { runnerURN: "ppb:excRunner:1.160337366/11/0" },
              { runnerURN: "ppb:excRunner:1.160337366/12/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:fixture:29465861", __typename: "FixtureCard" } },
    { node: { urn: "ppb:tbd:card:29436223:CORRECT_SCORE", __typename: "MarketCard" } },
  ],
};

const BFF_MOCK_EMPTY_EDGES = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
      },
      score: null,
    },
  ],
};

const SCA_PRE_PENALTY_SHOOTOUT_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        period: "EXTRA",
        status: "PENALTY_SHOOTOUT",
        stoppageMinutes: "0",
        clock: {
          minute: 120,
          second: 0,
        },
        score: {},
      },
      penaltyShootout: {
        firstTeamToShoot: "HOME",
        nextTeamToShoot: "HOME",
      },
    },
  ],
};

describe("Sticky Football Scoreboard", () => {
  describe("[603265] Given I open a football event in preplay state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(avbFixturePO.element);
      await browser.waitUntilDisplayed(eventPagePO.markets[0]);
    });

    it("[PRPI-5777] Then the fixture card should be visible", async () => {
      expect(await avbFixturePO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5778] And there should be one market visible", async () => {
      expect(await eventPagePO.markets.length).toBe(1);
    });

    it("[PRPI-5779] And the displayed market should have 12 runners", async () => {
      expect(await marketPO.runnerList.length).toBe(12);
    });

    it("[PRPI-5780] And the competition title should be 'English Premier League'", async () => {
      expect(await avbFixturePO.avbFixtureTitle.getText()).toBe("English Premier League");
    });

    describe("[603267] Then the user scrolls to the last runner in the market, the scoreboard should become sticky", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EMPTY_EDGES));
        await lastRunnerPO.element.scrollIntoView({ behavior: "smooth", inline: "end" });
        await browser.waitUntilDisplayed(stickyFixtureHeaderPO.element);
      });

      it("[PRPI-5781] And the home team name should be: Ukraine and away team name should be: Portugal", async () => {
        expect(await scoreboardHomeTeamPO.name.getText()).toBe("Ukraine");
        expect(await scoreboardAwayTeamPO.name.getText()).toBe("Portugal");
      });

      it("[PRPI-5782] And datetime displayed should be: Oct 14, 19:45", async () => {
        expect(await scoreboardDurationPO.datetime.getText()).toBe("Oct 14,\n19:45");
      });

      it("[PRPI-5783] And the competition title should not be displayed", async () => {
        expect(await avbFixturePO.avbFixtureTitle.isDisplayed()).toBe(false);
      });

      it("[PRPI-5784] And the sticky style should be applied on the scoreboard", async () => {
        expect(await stickyFixtureHeaderPO.element.isDisplayed()).toBe(true);
      });

      describe("[613989] Then the game goes into PENALTY_SHOOTOUT state", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PENALTY_SHOOTOUT_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilDisplayed(stickyFixtureHeaderPO.element);
          await browser.waitUntilDisplayed(footballScoreboardPenaltiesPO.element);
        });

        it("[PRPI-5785] And the penalties container should be displayed", async () => {
          expect(await footballScoreboardPenaltiesPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-5785] And the home team name should be: Ukraine and away team name should be: Portugal", async () => {
          expect(await scoreboardHomeTeamPO.name.getText()).toBe("Ukraine");
          expect(await scoreboardAwayTeamPO.name.getText()).toBe("Portugal");
        });

        it("[PRPI-5785] And the status label should be: ET FT", async () => {
          expect(await scoreboardDurationPO.status.getText()).toBe("ET\nFT");
        });

        it("[PRPI-5785] And the home score should display: 2", async () => {
          expect(await scoreboardScorePO.teamAScore.getText()).toBe("2");
        });

        it("[PRPI-5785] And the away score should display: 2", async () => {
          expect(await scoreboardScorePO.teamBScore.getText()).toBe("2");
        });

        it("[PRPI-5785] And it should be 5 penalty kicks displayed on each side", async () => {
          expect(await footballScoreboardHomePenaltiesPO.kick.length).toBe(5);
          expect(await footballScoreboardAwayPenaltiesPO.kick.length).toBe(5);
        });

        it("[PRPI-5785] And the first home penalty kick should be displayed as: INPLAY", async () => {
          expect(
            await browser.containsClass(footballScoreboardHomePenaltiesPO.kick[0], PenaltiesPO.states.inPlay),
          ).toBe(true);
        });

        it("[PRPI-5785] And the penalties score should display: 0 - 0", async () => {
          expect(await footballScoreboardPenaltiesPO.score.getText()).toBe("0 - 0");
        });
      });
    });
  });
});
