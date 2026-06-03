const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { SportsbookBetButtonSO, AlertSO, SportsbookPlacePanelSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../helpers/urls");

const mockService = new MockService();

const sportsbookBetButtonSO = new SportsbookBetButtonSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const placeNotificationSO = new AlertSO(sportsbookPlacePanelSO.element);

const MODULE_NAME = "betslip_sbk_pbm";
const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "PriceBoostMultisListCard",
        urn: `ppb:tbd:card:priceboostmultislist:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
        title: "Price Boost",
        showWasPrice: true,
        hasNextPage: false,
        endCursor: "Ma==",
        edges: [
          {
            node: {
              urn: "ppb:bettingOpportunity:popular:bo-1|1|0|0",
              id: "1",
              originalOdds: { decimal: 2.3 },
              type: "BOOSTED_BETS",
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
              ],
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PriceBoostMultisListCard",
        urn: `ppb:tbd:card:priceboostmultislist:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
      },
    },
  ],
};

const FIRST_RUNNER_SIB = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const RUNNERS = [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB];

const BO_COMBINATION = {
  betType: "DOUBLE",
  features: ["BOOSTED_COMBINATION"],
  averageOdds: 81.81,
  winAverageOdds: 81.81,
  combinationGroupId: "1",
  legCombinations: [
    {
      runners: [FIRST_RUNNER_SIB.runner],
    },
    {
      runners: [SECOND_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 81.81 },
    },
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 81.81 },
    },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const BO_MOCK = {
  betCombinations: [BO_COMBINATION],
  runnerOdds: RUNNERS,
};

const SMP_MOCK = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: { decimalDisplayOdds: { decimalOdds: 1.1 } },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            originalWinAvgOdds: {
              decimalDisplayOdds: {
                decimalOdds: 2.3,
              },
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
            trueOdds: { decimalDisplayOdds: { decimalOdds: 2.0 } },
            decimalDisplayOdds: { decimalOdds: 2.0 },
            originalWinAvgOdds: {
              decimalDisplayOdds: {
                decimalOdds: 2.3,
              },
            },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [
    {
      marketId: `${SECOND_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            trueOdds: { decimalDisplayOdds: { decimalOdds: 2.0 } },
            decimalDisplayOdds: { decimalOdds: 2.0 },
            originalWinAvgOdds: {
              decimalDisplayOdds: {
                decimalOdds: 2.3,
              },
            },
          },
        },
      ],
    },
  ],
};

const PBM_LEG_FAILURE_MOCK = {
  betCombinations: [],
  runnerOdds: [
    {
      runner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      runner: {
        marketId: SECOND_MARKET_ID,
        selectionId: 2,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  betFailures: [],
  legFailures: [
    {
      failedLeg: {
        betRunners: [
          {
            runner: {
              marketId: FIRST_MARKET_ID,
              selectionId: 1,
            },
          },
        ],

        combinationGroupId: "1",
        legType: "SIMPLE_SELECTION",
      },
      failureCode: "INVALID_BOOST_COMBINATION",
    },
    {
      failedLeg: {
        betRunners: [
          {
            runner: {
              marketId: SECOND_MARKET_ID,
              selectionId: 2,
            },
          },
        ],

        combinationGroupId: "1",
        legType: "SIMPLE_SELECTION",
      },
      failureCode: "INVALID_BOOST_COMBINATION",
    },
  ],
};

const PBM_RUNNER_FAILURE_MOCK = {
  betCombinations: [],
  runnerOdds: [
    {
      runner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      runner: {
        marketId: SECOND_MARKET_ID,
        selectionId: 2,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 1,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],

  legFailures: [],
};

describe("Betslip - Price Boost Section", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));

    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await mockService.mockHttpRequest(getImplyBetsResponse(BO_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "81.81");
  });

  describe("when users adds a price boost multi with a leg failure to Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(PBM_LEG_FAILURE_MOCK, { ignoreLegsOrder: true }));

      await sportsbookBetButtonSO.odd.click();
      await browser.waitUntilContainsText(placeNotificationSO.message, "Price Boost no longer available");

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4304]_should_render_price_boost_section_with_leg_errors`,
      );
    });

    it("[PRPI-4304]_should_render_price_boost_section_with_leg_errors", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4304]_should_render_price_boost_section_with_leg_errors`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
  describe("when users adds a price boost multi with a runner failure to Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CLOSED, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(PBM_RUNNER_FAILURE_MOCK, { ignoreLegsOrder: true }));

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4883]_should_render_price_boost_section_with_runner_errors`,
      );
    });

    it("[PRPI-4883]_should_render_price_boost_section_with_runner_errors", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4883]_should_render_price_boost_section_with_runner_errors`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
