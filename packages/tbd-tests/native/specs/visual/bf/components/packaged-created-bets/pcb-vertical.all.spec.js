const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  getSportsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const PackagedCreatedBetsCardSO = require("@ppb/tbd-shared/components/PackagedCreatedBetsCard/PackagedCreatedBetsCard.native.so");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const { ShowMoreSO, SportsbookBetButtonSO, RunnerSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const sportsbookBetButtonSO = new SportsbookBetButtonSO();
const showMoreSO = new ShowMoreSO();

const MODULE_NAME = "pcb_vertical";
const EVENT_TYPE_ID = 1;
const EVENT_ID = 12345;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";
const FOURTH_MARKET_ID = "924.4";
const FIFTH_MARKET_ID = "924.5";
const SIXTH_MARKET_ID = "924.6";
const SEVENTH_MARKET_ID = "924.7";
const EIGHT_MARKET_ID = "924.8";
const NINTH_MARKET_ID = "924.9";
const TENTH_MARKET_ID = "924.10";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "PackagedCreatedBetsCard",
        urn: `ppb:tbd:card:packagedcreatedbets:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
        title: "#RequestABet",
        hasNextPage: true,
        endCursor: "Ma==",
        edges: [
          {
            node: {
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
          {
            node: {
              urn: "ppb:bettingOpportunity:popular:bo-2|1|0|0",
              count: 1,
              displayName: "Super Betting Opportunity",
              selections: [
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                    name: "Anytime Goalscorer",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/1`,
                        selectionId: 1,
                        name: "Sgt Carneiro",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/1`,
                    selectionId: 1,
                  },
                },
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}`,
                    name: "Missed Shots Over/Under 100.5",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/2`,
                        selectionId: 2,
                        name: "Alberto Silva",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/2`,
                    selectionId: 2,
                  },
                },
              ],
            },
          },
          {
            node: {
              urn: "ppb:bettingOpportunity:popular:bo-3|1|0|0",
              count: 81,
              displayName: "Another Mega Betting Opportunity",
              selections: [
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${FIFTH_MARKET_ID}`,
                    name: "Anytime Goalscorer",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/1`,
                        selectionId: 1,
                        name: "Sgt Carneiro",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${FIFTH_MARKET_ID}/1`,
                    selectionId: 1,
                  },
                },
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${SIXTH_MARKET_ID}`,
                    name: "Missed Shots Over/Under 100.5",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SIXTH_MARKET_ID}/2`,
                        selectionId: 2,
                        name: "Alberto Silva",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${SIXTH_MARKET_ID}/2`,
                    selectionId: 2,
                  },
                },
              ],
            },
          },
          {
            node: {
              urn: "ppb:bettingOpportunity:popular:bo-4|1|0|0",
              count: 81,
              displayName: "More Betting Opportunity",
              selections: [
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${SEVENTH_MARKET_ID}`,
                    name: "Anytime Goalscorer",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SEVENTH_MARKET_ID}/1`,
                        selectionId: 1,
                        name: "Sgt Carneiro",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${SEVENTH_MARKET_ID}/1`,
                    selectionId: 1,
                  },
                },
                {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: `ppb:sbkMarket:${EIGHT_MARKET_ID}`,
                    name: "Missed Shots Over/Under 100.5",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${EIGHT_MARKET_ID}/2`,
                        selectionId: 2,
                        name: "Alberto Silva",
                      },
                    ],

                    isOddsboostMarketType: false,
                  },
                  runner: {
                    runnerURN: `ppb:sbkRunner:${EIGHT_MARKET_ID}/2`,
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
        __typename: "PackagedCreatedBetsCard",
        urn: `ppb:tbd:card:packagedcreatedbets:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
      },
    },
  ],
};

const BFF_SHOW_MORE_MOCK = {
  cards: [
    {
      __typename: "PackagedCreatedBetsCard",
      urn: `ppb:tbd:card:packagedcreatedbets:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
      title: "#RequestABet",
      hasNextPage: false,
      edges: [
        {
          node: {
            urn: "ppb:bettingOpportunity:popular:bo-5|1|0|0",
            count: 81,
            displayName: "Fetched More Betting Opportunity",
            selections: [
              {
                market: {
                  __typename: "SportsbookMarket",
                  urn: `ppb:sbkMarket:${NINTH_MARKET_ID}`,
                  name: "Anytime Goalscorer",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:${EVENT_ID}`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: `ppb:sbkRunner:${NINTH_MARKET_ID}/1`,
                      selectionId: 1,
                      name: "Sgt Carneiro",
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: `ppb:sbkRunner:${NINTH_MARKET_ID}/1`,
                  selectionId: 1,
                },
              },
              {
                market: {
                  __typename: "SportsbookMarket",
                  urn: `ppb:sbkMarket:${TENTH_MARKET_ID}`,
                  name: "Missed Shots Over/Under 100.5",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:${EVENT_ID}`,
                    },
                  },
                  runners: [
                    {
                      runnerURN: `ppb:sbkRunner:${TENTH_MARKET_ID}/2`,
                      selectionId: 2,
                      name: "Alberto Silva",
                    },
                  ],

                  isOddsboostMarketType: false,
                },
                runner: {
                  runnerURN: `ppb:sbkRunner:${TENTH_MARKET_ID}/2`,
                  selectionId: 2,
                },
              },
            ],
          },
        },
      ],
    },
  ],
};

const FIRST_RUNNER_SIB = {
  runner: { marketId: FIRST_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SECOND_RUNNER_SIB = {
  runner: { marketId: SECOND_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const FOURTH_RUNNER_SIB = {
  runner: { marketId: FOURTH_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const FIFTH_RUNNER_SIB = {
  runner: { marketId: FIFTH_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const SIXTH_RUNNER_SIB = {
  runner: { marketId: SIXTH_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SEVENTH_RUNNER_SIB = {
  runner: { marketId: SEVENTH_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const EIGHT_RUNNER_SIB = {
  runner: { marketId: EIGHT_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const NINTH_RUNNER_SIB = {
  runner: { marketId: NINTH_MARKET_ID, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.0 } },
    decimalDisplayOdds: { decimalOdds: 2.0 },
  },
};

const TENTH_RUNNER_SIB = {
  runner: { marketId: TENTH_MARKET_ID, selectionId: 2 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const RUNNERS = [
  FIRST_RUNNER_SIB,
  SECOND_RUNNER_SIB,
  THIRD_RUNNER_SIB,
  FOURTH_RUNNER_SIB,
  FIFTH_RUNNER_SIB,
  SIXTH_RUNNER_SIB,
  SEVENTH_RUNNER_SIB,
  EIGHT_RUNNER_SIB,
  NINTH_RUNNER_SIB,
  TENTH_RUNNER_SIB,
];

const OP_ONE_COMBINATION = {
  betType: "DOUBLE",
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
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 81.81 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 81.81 } },
  },
};

const OP_TWO_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 100.1,
  winAverageOdds: 100.1,
  combinationGroup: 1,
  legCombinations: [
    {
      runners: [THIRD_RUNNER_SIB.runner],
    },
    {
      runners: [FOURTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 100.1 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 100.1 } },
  },
};

const OP_THREE_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 120.22,
  winAverageOdds: 120.22,
  combinationGroup: 2,
  legCombinations: [
    {
      runners: [FIFTH_RUNNER_SIB.runner],
    },
    {
      runners: [SIXTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 120.22 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 120.22 } },
  },
};

const OP_FOUR_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 155.21,
  winAverageOdds: 155.21,
  combinationGroup: 3,
  legCombinations: [
    {
      runners: [SEVENTH_RUNNER_SIB.runner],
    },
    {
      runners: [EIGHT_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 155.21 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 155.21 } },
  },
};

const OP_FIFTH_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 188.45,
  winAverageOdds: 188.45,
  combinationGroup: 4,
  legCombinations: [
    {
      runners: [NINTH_RUNNER_SIB.runner],
    },
    {
      runners: [TENTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 188.45 } },
    prettyDisplayOdds: { decimalOdds: { decimalOdds: 188.45 } },
  },
};

const SIB_MOCK = {
  betCombinations: [OP_ONE_COMBINATION, OP_TWO_COMBINATION, OP_THREE_COMBINATION, OP_FOUR_COMBINATION],
  runnerOdds: RUNNERS,
};

const SIB_SHOW_MORE_MOCK = {
  betCombinations: [...SIB_MOCK.betCombinations, OP_FIFTH_COMBINATION],
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
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
          },
        },
      ],
    },
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
          },
        },
      ],
    },
    {
      marketId: `${FOURTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.0 },
          },
        },
      ],
    },
    {
      marketId: `${FIFTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
        },
      ],
    },
    {
      marketId: `${SIXTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.0 },
          },
        },
      ],
    },
    {
      marketId: `${SEVENTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 7.0 },
          },
        },
      ],
    },
    {
      marketId: `${EIGHT_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8.0 },
          },
        },
      ],
    },
    {
      marketId: `${NINTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 9.0 },
          },
        },
      ],
    },
    {
      marketId: `${TENTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 10.0 },
          },
        },
      ],
    },
  ],
};

describe("PackagedCreatedBetsCard", () => {
  describe("Vertical List Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK, { ignoreLegsOrder: true }));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = `football/s-${EVENT_TYPE_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "81.81");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4519]_should_render_vertical_card`);
    });

    it("[PRPI-4519]_should_render_vertical_card", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4519]_should_render_vertical_card`)).misMatchPercentage,
      ).toEqual(0);
    });

    describe("Show More", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SHOW_MORE_MOCK, { ignoreLegsOrder: true }));
        await mockService.mockHttpRequest(getCardResults(BFF_SHOW_MORE_MOCK));
        await showMoreSO.element.click();

        const pcbSO = new PackagedCreatedBetsCardSO();
        const fifthRunnerSO = new RunnerSO(pcbSO.opportunities[4]);

        const fifthBetButtonSO = new SportsbookBetButtonSO(fifthRunnerSO.sbkBetButtons[0]);

        await browser.waitUntilEquals(fifthBetButtonSO.odd, "188.45");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4520]_should_render_vertical_card_expanded`);
      });

      it("[PRPI-4520]_should_render_vertical_card_expanded", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4520]_should_render_vertical_card_expanded`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
