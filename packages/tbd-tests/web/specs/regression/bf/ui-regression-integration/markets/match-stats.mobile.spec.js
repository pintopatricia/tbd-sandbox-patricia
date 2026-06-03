const {
  MatchStatsPO,
  BarStatsContainerPO,
  CardStatsContainerPO,
  BarStatPO,
  CardStatPO,
} = require("../../../../../page-objects");

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const matchStatsCard = new MatchStatsPO();
const detailedBarStatsPO = new BarStatsContainerPO(matchStatsCard.barStatsContainer);
const shotsOffTargetPO = new BarStatPO(detailedBarStatsPO.barStats[2]);
const dangerousAttacksPO = new BarStatPO(detailedBarStatsPO.barStats[3]);
const detailedCardStatsPO = new CardStatsContainerPO(matchStatsCard.cardStatsContainer);
const redCardsPO = new CardStatPO(detailedCardStatsPO.cardStats[0]);
const yellowCardsPO = new CardStatPO(detailedCardStatsPO.cardStats[1]);
const cornersPO = new CardStatPO(detailedCardStatsPO.cardStats[2]);
const detailedStatsPO = new BarStatsContainerPO(matchStatsCard.statsContainer);
const goalKicksPO = new BarStatPO(detailedStatsPO.barStats[0]);
const offsidesPO = new BarStatPO(detailedStatsPO.barStats[1]);
const freeKicksPO = new BarStatPO(detailedStatsPO.barStats[2]);
const throwInsPO = new BarStatPO(detailedStatsPO.barStats[3]);
const foulsPO = new BarStatPO(detailedStatsPO.barStats[4]);
const blockedShotsPO = new BarStatPO(detailedStatsPO.barStats[5]);

const mockService = new MockService();

const EVENT_ID = "29465861";

const BFF_MOCK = {
  nextPageCursor: "nextCursor",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Real Madrid",
  },
  edges: [
    {
      node: {
        __typename: "MatchStatsCard",
        urn: "ppb:tbd:card:matchstats##29465861",
        home: "Wolves",
        away: "Real Madrid",
        sportevent: {
          eventName: "Wolves v Real Madrid",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
        },
        contentTitle: "Match Stats",
        footballFixture: {
          urn: "ppb:fixture:29465861",
          home: {
            name: "Wolves",
            color: "FDB913",
          },
          away: {
            name: "Real Madrid",
            color: "FFFFFF",
          },
          scheduledAt: "2010-10-14T18:45Z",
          stats: [
            {
              periodStatus: "FULL",
              home: {},
              away: {},
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MatchStatsCard",
        urn: "ppb:tbd:card:matchstats##29465861",
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      score: {},
      duration: {},
      stats: [
        {
          periodStatus: "FULL",
          home: {},
          away: {},
        },
      ],
    },
  ],
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        status: "INPLAY_FIRST_HALF",
        clock: {},
      },
      stats: [
        {
          periodStatus: "FULL",
          home: {
            possession: 70,
            corners: 6,
            shotsOffTarget: 5,
            yellowCards: 3,
            shotsOnTarget: 5,
            fouls: 3,
            offsides: 4,
            dangerousAttacks: 6,
          },
          away: {
            possession: 30,
            corners: 4,
            yellowCards: 5,
            shotsOnTarget: 3,
            fouls: 4,
            freeKicks: 2,
            dangerousAttacks: 4,
            goalKicks: 1,
          },
        },
        {
          periodStatus: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          home: {
            possession: 70,
            corners: 3,
            shotsOffTarget: 5,
            yellowCards: 2,
            shotsOnTarget: 3,
            fouls: 1,
            offsides: 4,
            dangerousAttacks: 6,
          },
          away: {
            possession: 30,
            corners: 2,
            yellowCards: 3,
            shotsOnTarget: 1,
            fouls: 2,
            freeKicks: 2,
            dangerousAttacks: 4,
            goalKicks: 1,
          },
        },
      ],
    },
  ],
};

const SCA_END_TIME_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        status: "END",
      },
      stats: [
        {
          periodStatus: "FULL",
          home: {
            possession: 69,
            corners: 3,
            shotsOffTarget: 5,
            yellowCards: 2,
            shotsOnTarget: 5,
            fouls: 1,
            offsides: 4,
            dangerousAttacks: 6,
          },
          away: {
            possession: 31,
            corners: 2,
            yellowCards: 3,
            shotsOnTarget: 4,
            fouls: 2,
            freeKicks: 2,
            dangerousAttacks: 4,
            goalKicks: 1,
          },
        },
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "REGULAR",
          home: {
            possession: 65,
            corners: 3,
            yellowCards: 1,
            shotsOnTarget: 2,
            fouls: 2,
          },
          away: {
            possession: 35,
            corners: 2,
            yellowCards: 2,
            shotsOnTarget: 2,
            fouls: 2,
          },
        },
        {
          periodStatus: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          home: {
            possession: 70,
            corners: 3,
            shotsOffTarget: 5,
            yellowCards: 2,
            shotsOnTarget: 3,
            fouls: 1,
            offsides: 4,
            dangerousAttacks: 6,
          },
          away: {
            possession: 30,
            corners: 2,
            yellowCards: 3,
            shotsOnTarget: 1,
            fouls: 2,
            freeKicks: 2,
            dangerousAttacks: 4,
            goalKicks: 1,
          },
        },
      ],
    },
  ],
};

const SCA_MISSING_STAT_MOCK = {
  fixture: [
    {
      score: {},
      duration: {
        status: "END",
      },
      stats: [
        {
          periodStatus: "FULL",
          home: {
            possession: 69,
            corners: 3,
            shotsOffTarget: 5,
            yellowCards: 2,
            shotsOnTarget: 5,
            fouls: 1,
            offsides: 4,
          },
          away: {
            possession: 31,
            corners: 2,
            yellowCards: 3,
            shotsOnTarget: 4,
            fouls: 2,
            freeKicks: 2,
            goalKicks: 1,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_FIRST_HALF",
          home: {
            possession: 65,
            corners: 3,
            yellowCards: 1,
            shotsOnTarget: 2,
            fouls: 2,
          },
          away: {
            possession: 35,
            corners: 2,
            yellowCards: 2,
            shotsOnTarget: 2,
            fouls: 2,
          },
        },
        {
          period: "REGULAR",
          periodStatus: "INPLAY_SECOND_HALF",
          home: {
            possession: 70,
            corners: 3,
            shotsOffTarget: 5,
            yellowCards: 2,
            shotsOnTarget: 3,
            fouls: 1,
            offsides: 4,
          },
          away: {
            possession: 30,
            corners: 2,
            yellowCards: 3,
            shotsOnTarget: 1,
            fouls: 2,
            freeKicks: 2,
            goalKicks: 1,
          },
        },
      ],
    },
  ],
};

describe("Match stats", () => {
  describe("[626610] When user lands on a football event in PRE_MATCH state", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(matchStatsCard.element);
    });

    it("[PRPI-6827] Match stats should be displayed ", async () => {
      expect(await matchStatsCard.element.isDisplayed()).toBe(true);
    });

    describe("[626617] Then the game goes into INPLAY_FIRST_HALF state and REGULAR period", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
        await browser.tickFakeClock();
      });

      it("[PRPI-6828] Should display Match Stats", async () => {
        expect(await matchStatsCard.element.isDisplayed()).toBe(true);
      });
    });
  });

  describe("[626627] When there's Match Stats card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_END_TIME_MOCK));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(matchStatsCard.element);
    });

    it("[PRPI-6829] Shots Off Target statistic should display 5 - 0 ", async () => {
      expect(await shotsOffTargetPO.getLabel.getText()).toBe("Shots Off Target");
      expect(await shotsOffTargetPO.statisticsHome.getText()).toBe("5");
      expect(await shotsOffTargetPO.statisticsAway.getText()).toBe("0");
    });

    it("[PRPI-6830] And Dangerous Attacks statistic should display 6 - 4 ", async () => {
      expect(await dangerousAttacksPO.getLabel.getText()).toBe("Dangerous Attacks");
      expect(await dangerousAttacksPO.statisticsHome.getText()).toBe("6");
      expect(await dangerousAttacksPO.statisticsAway.getText()).toBe("4");
    });

    it("[PRPI-6831] And Red Cards statistic should display 0 - 0 ", async () => {
      expect(await redCardsPO.cardTitle.getText()).toBe("RED");
      expect(await redCardsPO.cardHomeStats.getText()).toBe("0");
      expect(await redCardsPO.cardAwayStats.getText()).toBe("0");
      expect(await redCardsPO.cardIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6832] And Yellow Cards statistic should display 2 - 3 ", async () => {
      expect(await yellowCardsPO.cardTitle.getText()).toBe("YELLOW");
      expect(await yellowCardsPO.cardHomeStats.getText()).toBe("2");
      expect(await yellowCardsPO.cardAwayStats.getText()).toBe("3");
      expect(await yellowCardsPO.cardIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-6833] And Corners statistic should display 3 - 2 ", async () => {
      expect(await cornersPO.cardTitle.getText()).toBe("CORNERS");
      expect(await cornersPO.cardHomeStats.getText()).toBe("3");
      expect(await cornersPO.cardAwayStats.getText()).toBe("2");
      expect(await cornersPO.cardIcon.isDisplayed()).toBe(true);
    });

    // TO DO: FIX THESE

    it("[PRPI-6834] And Goal Kicks statistic should display 0 - 1 ", async () => {
      expect(await goalKicksPO.getLabel.getText()).toBe("Goal Kicks");
      expect(await goalKicksPO.statisticsHome.getText()).toBe("0");
      expect(await goalKicksPO.statisticsAway.getText()).toBe("1");
    });

    it("[PRPI-6835] And Offsides statistic should display 4 - 0 ", async () => {
      expect(await offsidesPO.getLabel.getText()).toBe("Offsides");
      expect(await offsidesPO.statisticsHome.getText()).toBe("4");
      expect(await offsidesPO.statisticsAway.getText()).toBe("0");
    });

    it("[PRPI-6836] And Free Kicks statistic should display 0 - 2 ", async () => {
      expect(await freeKicksPO.getLabel.getText()).toBe("Free Kicks");
      expect(await freeKicksPO.statisticsHome.getText()).toBe("0");
      expect(await freeKicksPO.statisticsAway.getText()).toBe("2");
    });

    it("[PRPI-6837] And Throw-Ins statistic should display 0 - 0 ", async () => {
      expect(await throwInsPO.getLabel.getText()).toBe("Throw-Ins");
      expect(await throwInsPO.statisticsHome.getText()).toBe("0");
      expect(await throwInsPO.statisticsAway.getText()).toBe("0");
    });

    it("[PRPI-6838] And Fouls statistic should display 0 - 1 ", async () => {
      expect(await foulsPO.getLabel.getText()).toBe("Fouls");
      expect(await foulsPO.statisticsHome.getText()).toBe("1");
      expect(await foulsPO.statisticsAway.getText()).toBe("2");
    });

    it("[PRPI-6839] And Blocked Shots statistic should display 0 - 0 ", async () => {
      expect(await blockedShotsPO.getLabel.getText()).toBe("Blocked Shots");
      expect(await blockedShotsPO.statisticsHome.getText()).toBe("0");
      expect(await blockedShotsPO.statisticsAway.getText()).toBe("0");
    });

    describe("[626632] When a bar statistic is not available : Dangerous Attacks", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_MISSING_STAT_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(dangerousAttacksPO.getLabel, "Goal Kicks");
      });

      it("[PRPI-6840] Then the next statistic should replace it: Goal Kicks", async () => {
        expect(await dangerousAttacksPO.getLabel.getText()).toBe("Goal Kicks");
        expect(await goalKicksPO.getLabel.getText()).toBe("Offsides");
      });
    });
  });
});
