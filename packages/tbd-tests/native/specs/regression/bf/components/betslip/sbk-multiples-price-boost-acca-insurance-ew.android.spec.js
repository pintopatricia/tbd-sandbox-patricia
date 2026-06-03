const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getEventLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { swipeUpElement, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  PromoButtonSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  CardSO,
  RunnerSO,
  SportsbookMarketSO,
  BetslipDrawerSO,
  BetControlsSO,
  AccaInsuranceSO,
  OptionSO,
  PNLAndWhatIfSO,
  CurrencyNumberInputFieldSO,
  BetsSummarySO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  PrimaryButtonSO,
  AlertSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new CardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const multipleControlsReturnValuesSO = new PNLAndWhatIfSO(multipleControlsSO.returnsValueContainer);
const accaInsuranceSO = new AccaInsuranceSO(multipleControlsSO.accaInsurance);
const accaInsuranceOptionSO = new OptionSO(accaInsuranceSO.element);
const generosityWalletButtonSO = new PromoButtonSO(multipleControlsSO.generosityWalletButton);
const summarySO = new BetsSummarySO();

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();
const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const generosityWalletAlertSO = new AlertSO(multipleControlsSO.generosityAlertMessage);
const stakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const eachWayOptionSO = new OptionSO(multipleControlsSO.eachWay);

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const THIRD_EVENT_ID = 3;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const TOKENS = [
  { id: 20000000001, walletType: "PRICE_BOOST_TOKEN", amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, walletType: "PRICE_BOOST_TOKEN", amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
  {
    id: 20000000003,
    walletType: "ACCA_INSURANCE_TOKEN",
    amount: 0,
    expirationDate: "2025-02-02T00:01:10.000Z",
    lostLegs: 1,
    maxReturn: 12,
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.2 },
            },
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "6",
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "7",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.1 },
            },
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "8",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.2 },
            },
            decimalDisplayOdds: { decimalOdds: 3.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "9",
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FIRST_EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                          selectionId: 2,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "Porto",
                  },
                  away: {
                    name: "West Ham",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Porto v West Ham",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Third Card",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "Ermesinde",
                  },
                  away: {
                    name: "Astrumil",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Ermesinde v Astrumil",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/7`,
                          selectionId: 7,
                          name: "Ermesinde",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/8`,
                          selectionId: 8,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/9`,
                          selectionId: 9,
                          name: "Astrumil",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/7`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/8`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/9`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  tokens: {
    priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
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
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  tokens: {
    priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
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
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 2.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: THIRD_MARKET_ID,
          selectionId: 7,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 3.1,
  winAverageOdds: 3.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.1 },
    },
    decimalDisplayOdds: { decimalOdds: 3.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  tokens: {
    priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
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
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 7,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.1 },
    },
    decimalDisplayOdds: { decimalOdds: 3.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      hasBonusMoney: true,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      tokens: {
        priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(
          ({ id, amount }) => ({
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
          }),
        ),
        accaInsuranceTokens: TOKENS.filter(({ walletType }) => walletType === "ACCA_INSURANCE_TOKEN").map(
          ({ id, maxReturn, lostLegs, expirationDate }) => ({
            id: `${id}`,
            numberOfTokens: 2,
            amount: maxReturn,
            numberOfLegs: lostLegs,
            expirationDate,
            betBuildersRestricted: false,
            spApplicable: true,
          }),
        ),
      },
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      hasBonusMoney: true,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      accaInsuranceOffer: {
        decimalDisplayOdds: {
          decimalOdds: 2,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2 },
        },
      },
      tokens: {
        priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(
          ({ id, amount }) => ({
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
          }),
        ),
      },
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 2.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 2.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 3,
      tokens: {
        priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(
          ({ id, amount }) => ({
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
          }),
        ),
      },
    },
    {
      betType: "TRIXIE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 3.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 3.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 3.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
      tokens: {
        priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(
          ({ id, amount }) => ({
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
          }),
        ),
      },
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate, walletType, lostLegs, maxReturn }) => ({
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
              walletType,
              lostLegs,
              maxReturn,
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

describe("Betslip - SBK Price Boost, Acca Insurance, EW and Acca Insurance Tokens", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when user adds 3 selections to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));

      await swipeUpElement(firstRunnerSO.element, 700); // display both second and third card

      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));

      await browser.waitUntilClickableNative(thirdRunnerSO.sbkBetButtons[0]);
      await thirdRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "3");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    it("[PRPI-4095] should have ACCA Insurance title", async () => {
      expect(await accaInsuranceOptionSO.title.getText()).toBe("Apply ACCA Edge");
    });

    it("[PRPI-4096] should have the Generosity Wallet Button", async () => {
      expect(await generosityWalletButtonSO.element.isDisplayed()).toBe(true);
    });

    describe("when the user clicks on the ACCA Insurance checkbox", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(accaInsuranceOptionSO.checkbox);
        await accaInsuranceOptionSO.checkbox.click();
        await browser.waitUntil(() => accaInsuranceOptionSO.checkbox.isSelected(), {
          timeoutMsg: "Acca Insurance was not selected",
        });
        await browser.waitUntil(
          async () => (await generosityWalletButtonSO.element.getAttribute("selected")) === "false",
        );
      });

      it("[PRPI-4097] should have ACCA Insurance checkbox selected", async () => {
        expect(await accaInsuranceOptionSO.checkbox.isSelected()).toBe(true);
      });

      it("[PRPI-4715] should have the Generosity Wallet button on the unselected state", async () => {
        expect(await generosityWalletButtonSO.element.getAttribute("selected")).toBe("false");
      });

      it("[PRPI-4716] shouldn't have the Generosity Wallet Alert displayed", async () => {
        expect(await generosityWalletAlertSO.element.isDisplayed()).toBe(false);
      });

      describe("when the user clicks on the Generosity Wallet Button and applies a price boost token", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(generosityWalletButtonSO.element);
          await generosityWalletButtonSO.element.click();

          await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
          await firstExtraWalletCardOptionSO.checkbox.click();

          await generosityWalletApplyButtonSO.element.click();

          await swipeUpElement(multiplesCardSO.element, 300);

          await browser.waitUntil(
            async () => (await generosityWalletButtonSO.element.getAttribute("selected")) === "true",
          );
        });

        it("[PRPI-4717] should have ACCA Insurance checkbox unselected", async () => {
          expect(await accaInsuranceOptionSO.checkbox.isSelected()).toBe(false);
        });

        it("[PRPI-4717] should have the Generosity Wallet button on the selected state and the correct alert message for price boost token", async () => {
          expect(await generosityWalletButtonSO.element.getAttribute("selected")).toBe("true");
          expect(await generosityWalletAlertSO.message.getText()).toBe("2% Bet Boost Applied");
        });

        describe("When user adds a stake value of 0.12", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(stakeInputFieldSO.element);
            await stakeInputFieldSO.element.click();

            await stakeInputFieldSO.setValue("0.12");
            await hideKeyboard();
          });

          it("[PRPI-4099] should update have the returns value updated on the selection level", async () => {
            expect(await multipleControlsSO.returnsLabel.getText()).toBe("Returns ");
            expect(await multipleControlsSO.returnsLabel.getText()).toBe("Returns ");
            expect(await multipleControlsReturnValuesSO.previousPnl.getText()).toBe("$0.13");
            expect(await multipleControlsReturnValuesSO.pnl.getText()).toBe("$0.26");
          });

          it("[PRPI-4099] should have the returns value updated on the betslip level", async () => {
            expect(await summarySO.totalReturnsValue.getText()).toBe("$0.26");
          });

          describe("When the user click on EW checkbox", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(eachWayOptionSO.checkbox);
              await eachWayOptionSO.checkbox.click();
              await browser.waitUntil(() => eachWayOptionSO.checkbox.isSelected(), {
                timeoutMsg: "Each way checkbox was not selected",
              });
            });

            it("[PRPI-4717] should have the each way checkbox selected", async () => {
              expect(await eachWayOptionSO.checkbox.isSelected()).toBe(true);
            });

            it("[PRPI-4717] should have the generosity wallet button in the unselected state", async () => {
              expect(await generosityWalletButtonSO.element.getAttribute("selected")).toBe("false");
            });

            it("[PRPI-4717] shouldn't have the Generosity Wallet Alert displayed", async () => {
              expect(await generosityWalletAlertSO.element.isDisplayed()).toBe(false);
            });

            describe("When the user clicks on the Generosity Wallet Button and applies a price boost token again", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(generosityWalletButtonSO.element);
                await generosityWalletButtonSO.element.click();

                await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
                await firstExtraWalletCardOptionSO.checkbox.click();

                await generosityWalletApplyButtonSO.element.click();

                await browser.waitUntil(
                  async () => (await generosityWalletButtonSO.element.getAttribute("selected")) === "true",
                );
              });

              it("[PRPI-4717] should have the Generosity Wallet button on the selected state and the correct alert message for price boost token", async () => {
                expect(await generosityWalletButtonSO.element.getAttribute("selected")).toBe("true");
                expect(await generosityWalletAlertSO.message.getText()).toBe("2% Bet Boost Applied");
              });

              it("[PRPI-4717] should have the each way checkbox unselected", async () => {
                expect(await eachWayOptionSO.checkbox.isSelected()).toBe(false);
              });
            });
          });
        });
      });
    });
  });
});
