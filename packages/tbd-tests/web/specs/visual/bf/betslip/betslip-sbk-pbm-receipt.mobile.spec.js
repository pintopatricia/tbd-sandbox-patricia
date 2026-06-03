const { getPayloadMatcherImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const {
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SportsbookBetButtonPO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  AlertPO,
} = require("../../../../page-objects");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { addStake } = require("../../../../helpers/betslip.util");

const mockService = new MockService();
const sportsbookBetButtonPO = new SportsbookBetButtonPO();

const betControlsPO = new BetControlsPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(betControlsPO.currencyInput);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const placeNotification = new AlertPO(sportsbookReceiptPanelPO.element);

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

const SPB_MOCK = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      betType: "DOUBLE",
      features: ["BOOSTED_COMBINATION"],
      runners: [FIRST_RUNNER_SIB, SECOND_RUNNER_SIB],
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 2 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
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

const PBM_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [FIRST_RUNNER_SIB.runner],
        },
        {
          runners: [SECOND_RUNNER_SIB.runner],
        },
      ],

      betType: "DOUBLE",
      features: ["BOOSTED_COMBINATION"],
      combinationGroupId: "1",
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
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
        marketId: "924.2",
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
};

describe("Price Boost - Receipt Panel", () => {
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
    await mockService.mockHttpRequest(
      getPayloadMatcherImplyBetsResponse(PBM_MOCK, {
        betLegs: LEGS_PAYLOAD_MATCH,
      }),
    );

    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
    await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "81.81");
    await mockService.mockHttpRequest(
      getPayloadMatcherImplyBetsResponse(PBM_MOCK, {
        betLegs: LEGS_PAYLOAD_MATCH,
      }),
    );
    await sportsbookBetButtonPO.odd.click();
  });

  describe("when users places a price boost multi bet", () => {
    beforeAll(async () => {
      await stakeInputFieldPO.element.waitForClickable();
      await stakeInputFieldPO.element.click();
      await addStake(stakeInputFieldPO, "10");

      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();

      await browser.waitUntilEquals(placeNotification.message, "Bet placed successfully");

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1261]_should_render_pbm_receipt`);
    });

    it("[PRPI-1261]_should_render_pbm_receipt", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1261]_should_render_pbm_receipt`)).toBe(0);
    });
  });
});
