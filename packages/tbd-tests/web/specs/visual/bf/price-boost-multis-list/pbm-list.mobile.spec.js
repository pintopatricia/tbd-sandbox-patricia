const { ShowMorePO, SportsbookBetButtonPO, RunnerPO } = require("../../../../page-objects");
const { getPayloadMatcherImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const PriceBoostMultisListCardPO = require("@ppb/tbd-shared/components/PriceBoostMultisListCard/PriceBoostMultisListCard.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const sportsbookBetButtonPO = new SportsbookBetButtonPO();
const showMorePO = new ShowMorePO();
const pcbPO = new PriceBoostMultisListCardPO();

const MODULE_NAME = "pbm_list";
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
        __typename: "PriceBoostMultisListCard",
        urn: `ppb:tbd:card:priceboostmultislist:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
        title: "Price Boost",
        showWasPrice: true,
        hasNextPage: true,
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
          {
            node: {
              urn: "ppb:bettingOpportunity:popular:bo-2|1|0|0",
              id: "2",
              originalOdds: { decimal: 2.3 },
              count: 1,
              type: "BOOSTED_BETS",
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
              id: "3",
              originalOdds: { decimal: 2.3 },
              count: 81,
              type: "BOOSTED_BETS",
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
              id: "4",
              originalOdds: { decimal: 2.3 },
              type: "BOOSTED_BETS",
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
        __typename: "PriceBoostMultisListCard",
        urn: `ppb:tbd:card:priceboostmultislist:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
      },
    },
  ],
};

const BFF_SHOW_MORE_MOCK = {
  cards: [
    {
      __typename: "PriceBoostMultisListCard",
      urn: `ppb:tbd:card:priceboostmultislist:Zp5nEBAAACIAlHmk/s/${EVENT_TYPE_ID}`,
      title: "Price Boost",
      showWasPrice: true,
      hasNextPage: false,
      edges: [
        {
          node: {
            urn: "ppb:bettingOpportunity:popular:bo-5|1|0|0",
            id: "5",
            originalOdds: { decimal: 2.3 },
            count: 81,
            type: "BOOSTED_BETS",
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

const THIRD_RUNNER_SIB = {
  runner: { marketId: THIRD_MARKET_ID, selectionId: 1 },
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

const FOURTH_RUNNER_SIB = {
  runner: { marketId: FOURTH_MARKET_ID, selectionId: 2 },
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

const FIFTH_RUNNER_SIB = {
  runner: { marketId: FIFTH_MARKET_ID, selectionId: 1 },
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

const SIXTH_RUNNER_SIB = {
  runner: { marketId: SIXTH_MARKET_ID, selectionId: 2 },
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

const SEVENTH_RUNNER_SIB = {
  runner: { marketId: SEVENTH_MARKET_ID, selectionId: 1 },
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

const EIGHT_RUNNER_SIB = {
  runner: { marketId: EIGHT_MARKET_ID, selectionId: 2 },
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

const NINTH_RUNNER_SIB = {
  runner: { marketId: NINTH_MARKET_ID, selectionId: 1 },
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

const TENTH_RUNNER_SIB = {
  runner: { marketId: TENTH_MARKET_ID, selectionId: 2 },
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

const SINGLES = RUNNERS.map((RUNNER) => ({
  legCombinations: [
    {
      runners: [RUNNER.runner],
      legType: "SIMPLE_SELECTION",
    },
  ],

  averageOdds: 1.1,
  winAverageOdds: 1.1,
  winAvgOdds: {
    trueOdds: RUNNER.odds.trueOdds,
    decimalDisplayOdds: RUNNER.odds.decimalDisplayOdds,
  },
}));

const OP_ONE_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
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

const OP_TWO_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 100.1,
  winAverageOdds: 100.1,
  combinationGroupId: "2",
  legCombinations: [
    {
      runners: [THIRD_RUNNER_SIB.runner],
    },
    {
      runners: [FOURTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 100.1 },
    },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const OP_THREE_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 120.22,
  winAverageOdds: 120.22,
  combinationGroupId: "3",
  legCombinations: [
    {
      runners: [FIFTH_RUNNER_SIB.runner],
    },
    {
      runners: [SIXTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 120.22 },
    },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const OP_FOUR_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 155.21,
  winAverageOdds: 155.21,
  combinationGroupId: "4",
  legCombinations: [
    {
      runners: [SEVENTH_RUNNER_SIB.runner],
    },
    {
      runners: [EIGHT_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 155.21 },
    },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const OP_FIFTH_COMBINATION = {
  betType: "DOUBLE",
  features: ["SGM"],
  averageOdds: 188.45,
  winAverageOdds: 188.45,
  combinationGroupId: "5",
  legCombinations: [
    {
      runners: [NINTH_RUNNER_SIB.runner],
    },
    {
      runners: [TENTH_RUNNER_SIB.runner],
    },
  ],

  winAvgOdds: {
    prettyDisplayOdds: {
      decimalOdds: { decimalOdds: 188.45 },
    },
  },
  originalWinAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.3,
    },
  },
};

const SIB_MOCK = {
  betCombinations: [...SINGLES, OP_ONE_COMBINATION, OP_TWO_COMBINATION, OP_THREE_COMBINATION, OP_FOUR_COMBINATION],
  runnerOdds: RUNNERS,
};

const SIB_SHOW_MORE_MOCK = {
  betCombinations: [
    ...SINGLES,
    OP_ONE_COMBINATION,
    OP_TWO_COMBINATION,
    OP_THREE_COMBINATION,
    OP_FOUR_COMBINATION,
    OP_FIFTH_COMBINATION,
  ],

  runnerOdds: RUNNERS,
};

const SIB_MOCK_LEGS_PAYLOAD = [
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
  {
    betRunners: [THIRD_RUNNER_SIB],
    combinationGroupId: "2",
    isBoostedLeg: true,
  },
  {
    betRunners: [FOURTH_RUNNER_SIB],
    combinationGroupId: "2",
    isBoostedLeg: true,
  },
  {
    betRunners: [FIFTH_RUNNER_SIB],
    combinationGroupId: "3",
    isBoostedLeg: true,
  },
  {
    betRunners: [SIXTH_RUNNER_SIB],
    combinationGroupId: "3",
    isBoostedLeg: true,
  },
  {
    betRunners: [SEVENTH_RUNNER_SIB],
    combinationGroupId: "4",
    isBoostedLeg: true,
  },
  {
    betRunners: [EIGHT_RUNNER_SIB],
    combinationGroupId: "4",
    isBoostedLeg: true,
  },
];

const SIB_SHOW_MORE_LEGS_PAYLOAD = [
  ...SIB_MOCK_LEGS_PAYLOAD,
  {
    betRunners: [NINTH_RUNNER_SIB],
    combinationGroupId: "5",
    isBoostedLeg: true,
  },
  {
    betRunners: [TENTH_RUNNER_SIB],
    combinationGroupId: "5",
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
    {
      marketId: `${THIRD_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
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
      marketId: `${FOURTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.0 },
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
      marketId: `${FIFTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
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
      marketId: `${SIXTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.0 },
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
      marketId: `${SEVENTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 7.0 },
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
      marketId: `${EIGHT_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8.0 },
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
      marketId: `${NINTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 9.0 },
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
      marketId: `${TENTH_MARKET_ID}`,
      runnerDetails: [
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 10.0 },
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

describe("PriceBoostMultisListCard", () => {
  describe("Card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(
        getPayloadMatcherImplyBetsResponse(SIB_MOCK, {
          betLegs: SIB_MOCK_LEGS_PAYLOAD,
        }),
      );
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockFonts(getMockFonts());
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilEquals(sportsbookBetButtonPO.odd, "81.81");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1513]_should_render_pbm_list_card`);
    });

    it("[PRPI-1513]_should_render_pbm_list_card", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1513]_should_render_pbm_list_card`)).toBe(0);
    });

    describe("Show More", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getPayloadMatcherImplyBetsResponse(SIB_SHOW_MORE_MOCK, {
            betLegs: SIB_SHOW_MORE_LEGS_PAYLOAD,
          }),
        );
        await mockService.mockHttpRequest(getCardResults(BFF_SHOW_MORE_MOCK));
        await showMorePO.element.click();

        const fifthRunnerPO = new RunnerPO(pcbPO.opportunities[4]);
        const fifthBetButtonPO = new SportsbookBetButtonPO(fifthRunnerPO.sportsbookBetButton);

        await browser.waitUntilEquals(fifthBetButtonPO.odd, "188.45");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1514]_should_render_card_expanded`);
      });

      it("[PRPI-1514]_should_render_card_expanded", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1514]_should_render_card_expanded`)).toBe(0);
      });
    });
  });
});
