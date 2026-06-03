const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const { SportsbookMarketSO, RunnerSO, CardSO, TabsGroupSO } = require("../../../../screen-objects");

const mockService = new MockService();

const sportsbookMarketSO = new SportsbookMarketSO();
const cardSO = new CardSO();

const MARKET_ID = "924.222615477";
const EVENT_ID = "29682729";
const EVENT_TYPE_ID = 1;

const tabsSO = new TabsGroupSO();
const firstSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const secondSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[1]);
const thirdSportsbookRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[2]);

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Handicap Markets",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${MARKET_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:market:${MARKET_ID}`,
                cardTitle: "Alternative Handicaps",
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Villarreal",
                  },
                  away: {
                    name: "Arsenal",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Alternative Handicaps",
                      marketType: "MATCH_HANDICAP_WITH_TIE",
                      marketTypeName: null,
                      bettingType: "MOVING_HANDICAP",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Villarreal v Arsenal",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Villarreal",
                          handicap: 2,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "Handicap Draw",
                          handicap: "-2",
                          resultType: "LINE",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Arsenal",
                          handicap: 2,
                          resultType: "AWAY",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      bettingType: "MOVING_HANDICAP",
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: 2.0,
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2.0,
        },
        {
          selectionId: 48351,
          noOdds: true,
          handicap: 2.0,
        },
      ],
    },
  ],
};

const SMP_MOCK_HANDICAP_UPDATE = {
  markets: [
    {
      marketId: MARKET_ID,
      bettingType: "MOVING_HANDICAP",
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: -2.0,
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          handicap: 2.0,
        },
        {
          selectionId: 48351,
          noOdds: true,
          handicap: -2.0,
        },
      ],
    },
  ],
};

describe("Market Card Component - SKB Handicap Market", () => {
  describe("When user goes to a market card for a sbk handicap market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(cardSO.title, "Alternative Handicaps");
    });

    it("[PRPI-2527] The SBK market tab should not be visible", async () => {
      expect(await tabsSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-2528] The three runner names should be correct and with the respective handicap values", async () => {
      expect(await firstSportsbookRunnerSO.runnerName.getText()).toBe("Villarreal (+2)");
      expect(await secondSportsbookRunnerSO.runnerName.getText()).toBe("Handicap Draw (-2)");
      expect(await thirdSportsbookRunnerSO.runnerName.getText()).toBe("Arsenal (+2)");
    });

    describe("When the handicap values get updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_HANDICAP_UPDATE));
        await browser.waitUntilEquals(firstSportsbookRunnerSO.runnerName, "Villarreal (-2)");
      });

      it("[PRPI-2529] The three runner names should be correct and with the updated handicap values", async () => {
        expect(await firstSportsbookRunnerSO.runnerName.getText()).toBe("Villarreal (-2)");
        expect(await secondSportsbookRunnerSO.runnerName.getText()).toBe("Handicap Draw (+2)");
        expect(await thirdSportsbookRunnerSO.runnerName.getText()).toBe("Arsenal (-2)");
      });
    });
  });
});
