const {
  AppPO,
  EventPagePO,
  MinimizedPO,
  SportsbookReceiptPanelPO,
  BetBuildersCardPO,
  BetBuilderPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  BetsSummaryPO,
  PrimaryButtonPO,
  PNLAndWhatIfPO,
  BetSegmentsPO,
  SportsbookPlacePanelPO,
  BetBuilderSummaryPO,
  PromoButtonPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  GenerosityWalletPO,
  AlertPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const thirdCardPO = new CardPO(eventPagePO.markets[2]);
const fourthCardPO = new CardPO(eventPagePO.markets[3]);
const fifthCardPO = new CardPO(eventPagePO.markets[4]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const thirdSportsbookMarketPO = new SportsbookMarketPO(thirdCardPO.sportsbookMarket);
const fourthSportsbookMarketPO = new SportsbookMarketPO(fourthCardPO.sportsbookMarket);
const fifthSportsbookMarketPO = new SportsbookMarketPO(fifthCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const thirdMarketRunnerSportsbookPO = new RunnerPO(thirdSportsbookMarketPO.runnerList[0]);
const fourthMarketRunnerSportsbookPO = new RunnerPO(fourthSportsbookMarketPO.runnerList[0]);
const fifthMarketRunnerSportsbookPO = new RunnerPO(fifthSportsbookMarketPO.runnerList[0]);
const sportsbookMinimizedBetslipPO = new MinimizedPO();

const betslipDrawerPO = new BetslipDrawerPO();
const placePanelPO = new SportsbookPlacePanelPO();
const betBuildersCardPO = new BetBuildersCardPO(placePanelPO.element);
const firstBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const secondBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[1]);
const firstBetControlsPO = new BetControlsPO(firstBetBuilderPO.element);
const secondBetControlsPO = new BetControlsPO(secondBetBuilderPO.element);

const firstGenerosityWalletButtonPO = new PromoButtonPO(firstBetControlsPO.generosityWalletButton);
const secondGenerosityWalletButtonPO = new PromoButtonPO(secondBetControlsPO.generosityWalletButton);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();

const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);

const receiptPanelPO = new SportsbookReceiptPanelPO();

const firstBetBuildersGenerosityWalletsAlertPO = new AlertPO(receiptPanelPO.betBuilders[0]);
const secondBetBuildersGenerosityWalletsAlertPO = new AlertPO(receiptPanelPO.betBuilders[1]);

const firstBetBuilderControlsReturnValuesPO = new PNLAndWhatIfPO(firstBetControlsPO.returnsValueContainer);
const firstSingleControlsPO = new BetControlsPO(placePanelPO.collapsableSections[1]);

const firstSingleGenerosityWalletButtonPO = new PromoButtonPO(firstSingleControlsPO.generosityWalletButton);

const firstStakePO = new CurrencyNumberInputFieldPO(firstBetControlsPO.currencyInput);
const secondStakePO = new CurrencyNumberInputFieldPO(secondBetControlsPO.currencyInput);

const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);

const receiptFirstBBPO = new BetBuilderSummaryPO(receiptPanelPO.betBuilderSummaries[0]);
const receiptSecondBBPO = new BetBuilderSummaryPO(receiptPanelPO.betBuilderSummaries[1]);

const receiptFirstBBBetSegmentsPO = new BetSegmentsPO(receiptFirstBBPO.element);
const receiptSecondBBBetSegmentsPO = new BetSegmentsPO(receiptSecondBBPO.element);

const sportsbookReceiptSummaryPO = new BetsSummaryPO(receiptPanelPO.summary);

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:event:29359895",
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
    urn: "ppb:event:29359000",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.11111111",
              marketType: "MATCH_ODDS_90",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:29359000",
                },
              },
              runners: [
                {
                  resultType: "HOME",
                  runnerURN: "ppb:sbkRunner:924.11111111/11111",
                  selectionId: 11111,
                  name: "Wolves",
                },
                {
                  resultType: "AWAY",
                  runnerURN: "ppb:sbkRunner:924.11111111/33333",
                  selectionId: 33333,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.11111111/11111" },
              { runnerURN: "ppb:sbkRunner:924.11111111/33333" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##HALF_TIME",
        title: "Half Time",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.22222222",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:29359000",
                },
              },
              runners: [
                {
                  resultType: "HOME",
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Wolves",
                },
                {
                  resultType: "AWAY",
                  runnerURN: "ppb:sbkRunner:924.22222222/66666",
                  selectionId: 66666,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.22222222/44444" },
              { runnerURN: "ppb:sbkRunner:924.22222222/66666" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##MATCH_ODDS`,
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.33333333",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Benfica v Braga",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.33333333/77777",
                  selectionId: 77777,
                  name: "Benfica",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.33333333/99999",
                  selectionId: 99999,
                  name: "Braga",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.33333333/77777" },
              { runnerURN: "ppb:sbkRunner:924.33333333/99999" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##HALF_TIME`,
        title: "Half Time",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.44444444",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Benfica v Braga",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.44444444/12121",
                  selectionId: 12121,
                  name: "Benfica",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.44444444/14141",
                  selectionId: 14141,
                  name: "Braga",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.44444444/12121" },
              { runnerURN: "ppb:sbkRunner:924.44444444/14141" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##CORRECT_SCORE`,
        title: "Correct Score",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.55555555",
              noLiveData: true,
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Benfica v Braga",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/22333",
                  selectionId: 22333,
                  name: "1-0",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/44555",
                  selectionId: 44555,
                  name: "2-0",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/66777",
                  selectionId: 66777,
                  name: "3-0",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.55555555/22333" },
              { runnerURN: "ppb:sbkRunner:924.55555555/44555" },
              { runnerURN: "ppb:sbkRunner:924.55555555/66777" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359895##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##CORRECT_SCORE", __typename: "MarketCard" } },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.11111111",
      runnerDetails: [
        {
          selectionId: "11111",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "33333",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.22222222",
      runnerDetails: [
        {
          selectionId: "44444",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "66666",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.33333333",
      runnerDetails: [
        {
          selectionId: "77777",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "99999",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.44444444",
      runnerDetails: [
        {
          selectionId: "12121",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "14141",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.55555555",
      runnerDetails: [
        {
          selectionId: "22333",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "44555",
          noOdds: true,
        },
        {
          selectionId: "66777",
          noOdds: true,
        },
      ],
    },
  ],
};

const TOKENS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
];

const FIRST_RUNNER = { marketId: "924.11111111", selectionId: 11111 };

const FIRST_SINGLE_MOCK = {
  legCombinations: [{ runners: [FIRST_RUNNER] }],
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_RUNNER = { marketId: "924.22222222", selectionId: 44444 };

const SECOND_SINGLE_MOCK = {
  legCombinations: [{ runners: [SECOND_RUNNER] }],
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};
const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 1.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.4 } },
    decimalDisplayOdds: { decimalOdds: 1.4 },
  },
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const FIRST_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_RUNNER = { marketId: "924.33333333", selectionId: 77777 };

const THIRD_SINGLE_MOCK = {
  legCombinations: [{ runners: [THIRD_RUNNER] }],
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const FOURTH_RUNNER = { marketId: "924.44444444", selectionId: 12121 };

const FOURTH_SINGLE_MOCK = {
  legCombinations: [{ runners: [FOURTH_RUNNER] }],
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};
const FOURTH_SINGLE_ODDS_MOCK = {
  runner: FOURTH_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, FOURTH_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const FIFTH_RUNNER = { marketId: "924.55555555", selectionId: 22333 };

const FIFTH_SINGLE_MOCK = {
  legCombinations: [{ runners: [FIFTH_RUNNER] }],
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};
const FIFTH_SINGLE_ODDS_MOCK = {
  runner: FIFTH_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [THIRD_RUNNER] }, { runners: [FOURTH_RUNNER] }, { runners: [FIFTH_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 4.5,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 4.5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.5 } },
    decimalDisplayOdds: { decimalOdds: 4.5 },
  },
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
  },
};

const FOURTH_SGM_MOCK = {
  betCombinations: [
    FIRST_DOUBLE_SGM,
    TREBLE_SGM,
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    FIFTH_SINGLE_MOCK,
  ],

  runnerOdds: [
    FIRST_SINGLE_ODDS_MOCK,
    SECOND_SINGLE_ODDS_MOCK,
    THIRD_SINGLE_ODDS_MOCK,
    FOURTH_SINGLE_ODDS_MOCK,
    FIFTH_SINGLE_ODDS_MOCK,
  ],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM", "PRICE_BOOST"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 1.0 } },
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }],
      legs: [{ leg: { betRunners: [{ runner: FIRST_RUNNER }] } }, { leg: { betRunners: [{ runner: SECOND_RUNNER }] } }],
      totalPotentialWin: 2.2,
      originalTotalPotentialWin: 1.4,
      totalStake: 1,
      betType: "DOUBLE",
    },
    {
      betModifiers: ["SGM"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 1.3 } },
      runners: [{ runner: THIRD_RUNNER }, { runner: FOURTH_RUNNER }, { runner: FIFTH_RUNNER }],
      legs: [
        { leg: { betRunners: [{ runner: THIRD_RUNNER }] } },
        { leg: { betRunners: [{ runner: FOURTH_RUNNER }] } },
        { leg: { betRunners: [{ runner: FIFTH_RUNNER }] } },
      ],

      totalPotentialWin: 4.5,
      totalStake: 1,
      originalTotalPotentialWin: 0,
      betType: "TREBLE",
    },
  ],
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}#1`,
            badges: [],
            extraWallet: {
              __typename: "ExtraWallet",
              urn: `ppb:extraWallet:${id}`,
              walletId: `${id}`,
              indexedId: `${id}#1`,
              amount,
              expirationDate,
              walletType: "PRICE_BOOST_TOKEN",
            },
            restrictions: {
              __typename: "WalletRestrictions",
              single: "false",
              acca: "false",
              sameGameMulti: "false",
            },
          },
          __typename: "ExtraWalletCardGroupEdge",
        })),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "1.00", walletName: "BOOST_TOKENS" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

describe("Bet Builders - price boost available", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getEventViewUrl(29359895)}`);
    await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: "1/2" }));
  });

  describe("when the user adds a bet builders to the betslip", () => {
    beforeAll(async () => {
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(firstMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(secondMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SGM_MOCK));
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const counter = await sportsbookMinimizedBetslipPO.counter.getText();

          return counter === "2";
        },
        { timeoutMsg: "Unexpected minimized counter value" },
      );
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilInViewport(betBuildersCardPO.element);
    });

    describe("and adds another bet builder", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.waitForClickable();
        await betslipDrawerPO.header.click();
        await browser.waitUntilInViewport(sportsbookMinimizedBetslipPO.counter);

        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(
          thirdMarketRunnerSportsbookPO.sportsbookBetButton,
          "Bet button is not visible",
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK));
        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.click();

        await fourthMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(
          fourthMarketRunnerSportsbookPO.sportsbookBetButton,
          "Bet button is not visible",
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
        await fourthMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
        await fourthMarketRunnerSportsbookPO.sportsbookBetButton.click();

        await fifthMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(
          fifthMarketRunnerSportsbookPO.sportsbookBetButton,
          "Bet button is not visible",
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(FOURTH_SGM_MOCK));
        await fifthMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
        await fifthMarketRunnerSportsbookPO.sportsbookBetButton.click();

        await browser.waitUntilInViewport(sportsbookMinimizedBetslipPO.element);
        await browser.waitUntil(
          async () => {
            const counter = await sportsbookMinimizedBetslipPO.counter.getText();

            return counter === "5";
          },
          { timeoutMsg: "Unexpected minimized counter value" },
        );

        await browser.waitUntilEquals(sportsbookMinimizedBetslipPO.title, "$10.00 Treble @ 3.5/1 returns $45.00");

        await sportsbookMinimizedBetslipPO.element.waitForClickable();
        await sportsbookMinimizedBetslipPO.element.click();
        await browser.waitUntilInViewport(betBuildersCardPO.element);
      });

      describe("and has stake on both bet builders", () => {
        beforeAll(async () => {
          await firstStakePO.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(firstStakePO.element, "second stake not displayed");
          await firstStakePO.numberField.waitForClickable();
          await firstStakePO.numberField.click();
          await firstStakePO.setValue("1");

          await secondStakePO.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(secondStakePO.element, "second stake not displayed");
          await secondStakePO.numberField.waitForClickable();
          await secondStakePO.numberField.click();
          await secondStakePO.setValue("1");
        });

        describe("And the first bet builder has the promo button selected", () => {
          beforeAll(async () => {
            await firstGenerosityWalletButtonPO.element.scrollIntoView({ block: "center" });
            await browser.waitUntilInViewport(
              firstGenerosityWalletButtonPO.element,
              "Free Bets Button is not displayed",
            );
            await firstGenerosityWalletButtonPO.element.waitForClickable();
            await firstGenerosityWalletButtonPO.element.click();
            await firstExtraWalletCardPO.element.waitForClickable();
            await firstExtraWalletCardPO.element.click();
            await generosityWalletApplyButtonPO.element.waitForClickable();
            await generosityWalletApplyButtonPO.element.click();
          });

          it("[PRPI-7693] should display the promo button in active state in the first bet builder", async () => {
            expect(
              await browser.containsClass(firstGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
            ).toBe(true);
          });

          it("[PRPI-7694] should display the new total returns", async () => {
            expect(await firstBetControlsPO.returnsLabel.getText()).toBe("Returns");
            expect(await firstBetBuilderControlsReturnValuesPO.previousPnl.getText()).toBe("$1.40");
            expect(await firstBetBuilderControlsReturnValuesPO.pnl.getText()).toBe("$2.20");
          });

          it("[PRPI-7693] should display the promo button in default state in the second bet builder", async () => {
            expect(
              await browser.containsClass(secondGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
            ).toBe(false);
          });

          it("[PRPI-7693] should display the promo button in default state in bet builder singles", async () => {
            expect(
              await browser.containsClass(firstSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
            ).toBe(false);

            expect(
              await browser.containsClass(firstSingleGenerosityWalletButtonPO.element, PromoButtonPO.states.disabled),
            ).toBe(false);
          });

          describe("when user places the bet", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
              await placeButtonPO.element.waitForClickable();
              await placeButtonPO.element.click();
              await browser.waitUntilDisplayed(receiptPanelPO.element, "receipt not displayed");
            });

            it("[PRPI-7695] should display the first bet builder with the new return", async () => {
              expect(await receiptFirstBBBetSegmentsPO.rightLabel.getText()).toBe("Returns");
              expect(await receiptFirstBBBetSegmentsPO.rightValue.getText()).toBe("$1.40\n$2.20");
            });

            it("[PRPI-7695] should display the boost odds label on the first bet builder", async () => {
              expect(await firstBetBuildersGenerosityWalletsAlertPO.message.getText()).toBe("Bet Boost Applied");
            });

            it("[PRPI-7695] should display the second bet builder without the new return", async () => {
              expect(await receiptSecondBBBetSegmentsPO.rightLabel.getText()).toBe("Returns");
              expect(await receiptSecondBBBetSegmentsPO.rightValue.getText()).toBe("$4.50");
            });

            it("[PRPI-7695] should not display the boost odds label on the second bet builder", async () => {
              expect(await secondBetBuildersGenerosityWalletsAlertPO.message.isExisting()).toBe(false);
            });

            it("[PRPI-7695] should display the correct returns on the receipt panel", async () => {
              expect(await sportsbookReceiptSummaryPO.totalReturnsValue.getText()).toBe("$5.90\n$6.70");
            });
          });
        });
      });
    });
  });
});
