const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { MatchStatsSO, CardStatSO, BarStatSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeUp, swipeDown } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();

const matchStatsSO = new MatchStatsSO();

const barStatContainerSO = new MatchStatsSO(matchStatsSO.barStatContainer);
const cardStatContainerSO = new MatchStatsSO(matchStatsSO.cardStatContainer);
const statContainerSO = new MatchStatsSO(matchStatsSO.statsContainer);

const lastBarBarStatContainerSO = new BarStatSO(barStatContainerSO.barsWrapper[3]);

const firstCardCardStatContainerSO = new CardStatSO(cardStatContainerSO.cardsWrapper[0]);

const firstBarStatContainerSO = new BarStatSO(statContainerSO.barsWrapper[0]);

const EVENT_ID = "29682729";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "MatchStatsCard",
        home: "Wolves",
        away: "Real Madrid",
        sportevent: {
          eventName: "Ukraine v Portugal",
          openDate: "2010-10-14T18:45Z",
          urn: `ppb:event:${EVENT_ID}`,
          __typename: "SportsEvent",
        },
        urn: `ppb:tbd:card:matchstats:${EVENT_ID}`,
        contentTitle: `Match Stats`,
        footballFixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Ukraine" },
          away: { name: "Portugal" },
          scheduledAt: "2010-10-14T18:45Z",
          stats: [
            {
              periodStatus: "FULL",
              home: {},
              away: {},
            },
          ],

          duration: {},
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MatchStatsCard",
        urn: `ppb:tbd:card:matchstats:${EVENT_ID}`,
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

const SCA_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
      score: {},
      duration: {
        status: "INPLAY_FIRST_HALF",
        clock: {},
      },
      stats: [
        {
          periodStatus: "FULL",
          home: {
            possession: 65,
            corners: 3,
            yellowCards: 1,
            shotsOnTarget: 2,
            fouls: 2,
            offsides: 1,
          },
          away: {
            possession: 35,
            corners: 2,
            yellowCards: 2,
            shotsOnTarget: 2,
            fouls: 2,
            redCards: 1,
            offsides: 1,
          },
        },
      ],
    },
  ],
};

const SCA_UPDATE_MOCK = {
  fixture: [
    {
      eventId: EVENT_ID,
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
      ],
    },
  ],
};

describe("Match stats card", () => {
  describe("When the user is in a football event with stats available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(matchStatsSO.element);
      await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
    });

    describe("[626617] And then the game goes into INPLAY_FIRST_HALF state and REGULAR period", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(lastBarBarStatContainerSO.label, "Goal Kicks");
      });

      it("[PRPI-2281] The match stats modal should display 3 containers", async () => {
        expect(await matchStatsSO.barStatContainer.isDisplayed()).toBe(true);
        expect(await matchStatsSO.cardStatContainer.isDisplayed()).toBe(true);
        expect(await matchStatsSO.statsContainer.isDisplayed()).toBe(true);
      });

      it("[PRPI-2282] The 1st container should display 4 bar stats with progress bar", async () => {
        expect(await barStatContainerSO.progressBars.length).toBe(4);
      });

      it("[PRPI-2283] The last bar stat of the 1st container should display: '0 Goal Kicks 0'", async () => {
        expect(await lastBarBarStatContainerSO.homeStats.getText()).toBe("0");
        expect(await lastBarBarStatContainerSO.label.getText()).toBe("Goal Kicks");
        expect(await lastBarBarStatContainerSO.awayStats.getText()).toBe("0");
      });

      it("[PRPI-2284] The 2nd container should display 3 card stats", async () => {
        expect(await matchStatsSO.cardsWrapper.length).toBe(3);
      });

      it("[PRPI-2285] The 1st card of the 2nd container should display an icon and: '0 RED 1'", async () => {
        expect(await firstCardCardStatContainerSO.icon.isDisplayed()).toBe(true);
        expect(await firstCardCardStatContainerSO.title.getText()).toBe("RED");
        expect(await firstCardCardStatContainerSO.homeStats.getText()).toBe("0");
        expect(await firstCardCardStatContainerSO.awayStats.getText()).toBe("1");
      });

      describe("When the user scrolls to the 3rd container", () => {
        beforeAll(async () => {
          await swipeUp();
        });

        afterAll(async () => {
          await swipeDown();
        });

        it("[PRPI-2286] The 3rd container should display 5 bar stats without progress bar", async () => {
          expect(await statContainerSO.barsWrapper.length).toBe(5);
          expect(await statContainerSO.progressBars.length).toBe(0);
        });

        it("[PRPI-2287] The 1st card of the 3rd container should display: '1 Offsides 1'", async () => {
          expect(await firstBarStatContainerSO.homeStats.getText()).toBe("1");
          expect(await firstBarStatContainerSO.label.getText()).toBe("Offsides");
          expect(await firstBarStatContainerSO.awayStats.getText()).toBe("1");
        });

        describe("And then the stats for dangerous attacks are not available anymore on the service response", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getScaResponse(SCA_UPDATE_MOCK));
            await browser.waitUntilEquals(lastBarBarStatContainerSO.awayStats, "1");
          });

          it("[PRPI-2288] The last bar stat of the 1st container should now display: '0 Goal Kicks 1'", async () => {
            expect(await lastBarBarStatContainerSO.homeStats.getText()).toBe("0");
            expect(await lastBarBarStatContainerSO.label.getText()).toBe("Goal Kicks");
            expect(await lastBarBarStatContainerSO.awayStats.getText()).toBe("1");
          });

          it("[PRPI-2288] The 1st card of the 3rd container should now display: '4 Offsides 0'", async () => {
            expect(await firstBarStatContainerSO.homeStats.getText()).toBe("4");
            expect(await firstBarStatContainerSO.label.getText()).toBe("Offsides");
            expect(await firstBarStatContainerSO.awayStats.getText()).toBe("0");
          });
        });
      });
    });
  });
});
