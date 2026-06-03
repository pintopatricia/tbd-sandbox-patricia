const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const PopularBetBuilderSO = require("@ppb/tbd-shared/components/PopularBetBuilderCard/PopularBetBuilderCard.so");

const {
  getSportsLayout,
  getAppContext,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { SportsbookBetButtonSO } = require("../../../../screen-objects");

const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { startApp } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const popularBetBuilderSO = new PopularBetBuilderSO();
const sportsbookBetButtonSO = new SportsbookBetButtonSO(popularBetBuilderSO.popularBetBuilderBetButton);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const COMPETITION_ID = 123;
const FIRST_MARKET_ID = 924.1;
const SECOND_MARKET_ID = 924.2;
const THIRD_MARKET_ID = 924.3;
const FOURTH_MARKET_ID = 924.4;
const FIFTH_MARKET_ID = 924.5;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Popular Bets",
        full: {
          edges: [
            {
              node: {
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:bo-1|1|0|0",
                fixture: {
                  __typename: "FootballFixture",
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Popular",
                  },
                  away: {
                    name: "Bet Builder",
                  },
                },
                viewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: `football/uefa-champions-league/chelsea-v-real-madrid/e-${EVENT_ID}`,
                },
                sportevent: {
                  name: "Popular vs Bet Builder",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "The Competition",
                  },
                },
                popularbettingopportunity: {
                  urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
                  count: 81,
                  selections: [
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                        name: "Anytime Goalscorer",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                            selectionId: 1,
                            name: "Sgt Carneiro",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                        selectionId: 1,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                        name: "Missed Shots Over/Under 100.5",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                            selectionId: 2,
                            name: "Alberto Silva",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                        selectionId: 2,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                        name: "Third Market",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                            selectionId: 3,
                            name: "Third Runner",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/3`,
                        selectionId: 3,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}`,
                        name: "Fourth Market",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/4`,
                            selectionId: 4,
                            name: "Fourth Runner",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/4`,
                        selectionId: 4,
                      },
                    },
                    {
                      market: {
                        __typename: "SportsbookMarket",
                        urn: `ppb:sbkMarket:${FIFTH_MARKET_ID}`,
                        name: "Fifth Market",
                        hierarchy: {
                          __typename: "EventHierarchy",
                          sportevent: {
                            urn: `ppb:event:${EVENT_ID}`,
                            name: "Popular v Bet Builder",
                          },
                        },
                        runners: [
                          {
                            runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/5`,
                            selectionId: 5,
                            name: "Fifth Runner",
                          },
                        ],

                        isOddsboostMarketType: false,
                      },
                      runner: {
                        runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/5`,
                        selectionId: 5,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PopularBetBuilderCard",
                urn: "ppb:tbd:card:popularbetbuilder:bo-1|1|0|0",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
  ],
};

const FIRST_RUNNER_SIB = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    americanDisplayOdds: {
      americanOdds: -1000.0,
      americanOddsInt: -1000,
    },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
    americanDisplayOdds: {
      americanOdds: 100.0,
      americanOddsInt: 100,
    },
  },
};

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 3 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.0 } },
    decimalDisplayOdds: { decimalOdds: 3.0 },
    americanDisplayOdds: {
      americanOdds: 200.0,
      americanOddsInt: 200,
    },
  },
};

const FOURTH_RUNNER_SIB = {
  runner: { marketId: FOURTH_MARKET_ID, selectionId: 4 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.0 } },
    decimalDisplayOdds: { decimalOdds: 4.0 },
    americanDisplayOdds: {
      americanOdds: 300.0,
      americanOddsInt: 300,
    },
  },
};

const FIFTH_RUNNER_SIB = {
  runner: { marketId: FIFTH_MARKET_ID, selectionId: 5 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 5.0 } },
    decimalDisplayOdds: { decimalOdds: 5.0 },
    americanDisplayOdds: {
      americanOdds: 400.0,
      americanOddsInt: 400,
    },
  },
};

const POPULAR_BET_BUILDER_COMBINATION = {
  betType: "FOURFOLD",
  features: ["SGM"],
  averageOdds: 81.81,
  winAverageOdds: 81.81,
  combinationGroup: 0,
  legCombinations: [
    {
      runners: [FIRST_RUNNER_SIB.runner],
    },
    {
      runners: [SECOND_RUNNER_SIB.runner],
    },
    {
      runners: [THIRD_RUNNER_SIB.runner],
    },
    {
      runners: [FOURTH_RUNNER_SIB.runner],
    },
    {
      runners: [FIFTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 81.81 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 81.81 } },
    americanDisplayOdds: {
      americanOdds: 8081.0,
      americanOddsInt: 8081,
    },
  },
};

const SIB_MOCK = {
  betCombinations: [POPULAR_BET_BUILDER_COMBINATION],
  runnerOdds: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB, THIRD_RUNNER_SIB, FOURTH_RUNNER_SIB, FIFTH_RUNNER_SIB],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            americanDisplayOdds: {
              americanOdds: -1000.0,
              americanOddsInt: -1000,
            },
          },
        },
      ],
    },
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.0 },
            americanDisplayOdds: {
              americanOdds: 100.0,
              americanOddsInt: 100,
            },
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
            americanDisplayOdds: {
              americanOdds: 200.0,
              americanOddsInt: 200,
            },
          },
        },
      ],
    },
    {
      marketId: `${FOURTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 4,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.0 },
            americanDisplayOdds: {
              americanOdds: 300.0,
              americanOddsInt: 300,
            },
          },
        },
      ],
    },
    {
      marketId: `${FIFTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 5,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
            americanDisplayOdds: {
              americanOdds: 400.0,
              americanOddsInt: 400,
            },
          },
        },
      ],
    },
  ],
};

describe("PopularBetBuilder", () => {
  describe("when the user selects American Odds as preferred format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getAppContext({
          sportsbookOddsDisplay: "AMERICAN",
        }),
      );
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = "football/s-1";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(popularBetBuilderSO.element);
    });

    it("[PRPI-3629] the odds should be displayed in american format", async () => {
      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "Add to Betslip at +8081");
      expect(await sportsbookBetButtonSO.odd.getText()).toBe("Add to Betslip at +8081");
    });
  });
});
