const { getPayloadMatcherImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  SportsbookBetButtonPO,
  AlertPO,
  SportsbookPlacePO,
  PriceBoostMultipleFailurePO,
} = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const pbmPO = new PriceBoostMultipleFailurePO();
const sbkPlace = new SportsbookPlacePO();
const firstAlertPO = new AlertPO(pbmPO.element);
const secondAlertPO = new AlertPO(sbkPlace.notificationsList);

const mockService = new MockService();
const sportsbookBetButtonPO = new SportsbookBetButtonPO();

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

const LEGS_PAYLOAD_MATCH = [
  {
    betRunners: [FIRST_RUNNER_SIB],
    combinationGroupId: "1",
    isBoostedLeg: true,
  },
  {
    betRunners: [SECOND_RUNNER_SIB],
    combinationGroupId: "1",
    isBoostedLeg: true,
  },
];

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

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      marketId: `${FIRST_MARKET_ID}`,
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: { decimalDisplayOdds: { decimalOdds: 2.1 } },
            decimalDisplayOdds: { decimalOdds: 2.1 },
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
  ],

  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 1,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],

  legFailures: [],
};

describe("Betslip - Price Boost Section", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(
      getPayloadMatcherImplyBetsResponse(
        BO_MOCK,
        {
          betLegs: LEGS_PAYLOAD_MATCH,
        },
        ".*implyBets.*pricePolicy=SUGGESTED.*",
      ),
    );
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "81.81");
  });

  describe("when users adds a price boost multi with a leg failure to Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getPayloadMatcherImplyBetsResponse(PBM_LEG_FAILURE_MOCK, {
          betLegs: LEGS_PAYLOAD_MATCH,
        }),
      );

      await sportsbookBetButtonPO.odd.click();
      await browser.waitUntilEquals(firstAlertPO.message, "Price Boost no longer available");

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1259]_should_render_price_boost_section_with_leg_errors`,
      );
    });

    it("[PRPI-1259]_should_render_price_boost_section_with_leg_errors", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1259]_should_render_price_boost_section_with_leg_errors`),
      ).toBe(0);
    });

    describe("when users adds a price boost multi with a runner failure to Betslip", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(
          getPayloadMatcherImplyBetsResponse(PBM_RUNNER_FAILURE_MOCK, {
            betLegs: LEGS_PAYLOAD_MATCH,
          }),
        );
        await browser.waitUntilEquals(firstAlertPO.message, "Price Boost no longer available");
        await browser.waitUntilEquals(secondAlertPO.message, "Market Suspended");

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1260]_should_render_price_boost_section_with_runner_errors`,
        );
      });

      it("[PRPI-1260]_should_render_price_boost_section_with_runner_errors", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1260]_should_render_price_boost_section_with_runner_errors`),
        ).toBe(0);
      });
    });
  });
});
