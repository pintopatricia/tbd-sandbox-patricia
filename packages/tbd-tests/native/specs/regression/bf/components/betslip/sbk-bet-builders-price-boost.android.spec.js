const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { swipeUpElement, swipeFromElementToElement, swipeDownElement } = require("../../../../../helpers/gestures");

const {
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  PromoButtonSO,
  BetBuildersCardSO,
  BetBuilderSO,
  GenericScreenSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  MinimizedSO,
  BetslipDrawerSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetsSummarySO,
  OptionSO,
  PNLAndWhatIfSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  AlertSO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();

const firstMatchOddsCardSO = new CardSO(genericScreenSO.cards[0]);
const secondMatchOddsCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdMatchOddsCardSO = new CardSO(genericScreenSO.cards[2]);
const fourthMatchOddsCardSO = new CardSO(genericScreenSO.cards[3]);

const firstSbkMarketSO = new InlineSportsbookMarketSO(firstMatchOddsCardSO.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondMatchOddsCardSO.contentWrapper);
const thirdSbkMarketSO = new InlineSportsbookMarketSO(thirdMatchOddsCardSO.contentWrapper);
const fourthSbkMarketSO = new InlineSportsbookMarketSO(fourthMatchOddsCardSO.contentWrapper);

const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[1]);
const thirdSbkRunnerSO = new SportsbookBetButtonSO(thirdSbkMarketSO.sbkBetButtons[0]);
const fourthSbkRunnerSO = new SportsbookBetButtonSO(fourthSbkMarketSO.sbkBetButtons[0]);

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const betBuildersCardSO = new BetBuildersCardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
const secondBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[1]);

const firstBetBuilderControlsSO = new BetControlsSO(firstBetBuilderSO.element);
const secondBetBuilderControlsSO = new BetControlsSO(secondBetBuilderSO.element);

const firstBetBuilderStakeInputFieldSO = new CurrencyNumberInputFieldSO(firstBetBuilderControlsSO.currencyInput);
const secondBetBuilderStakeInputFieldSO = new CurrencyNumberInputFieldSO(secondBetBuilderControlsSO.currencyInput);

const secondGenerosityWalletButtonSO = new PromoButtonSO(secondBetBuilderControlsSO.generosityWalletButton);

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();
const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);

const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const secondBetBuilderControlsReturnValuesSO = new PNLAndWhatIfSO(secondBetBuilderControlsSO.returnsValueContainer);

const betsSummarySO = new BetsSummarySO();

const receiptPanelSO = new SportsbookReceiptPanelSO();

const firstOddsBoostAlertSO = new AlertSO(receiptPanelSO.betBuilderSummaries[1]);

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const THIRD_EVENT_ID = 3;
const FOURTH_EVENT_ID = 4;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";
const FOURTH_MARKET_ID = "924.4";

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
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "3",
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
          selectionId: "4",
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
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
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
      ],
    },
    {
      marketId: FOURTH_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "7",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.4 },
            },
            decimalDisplayOdds: { decimalOdds: 1.4 },
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
              decimalOdds: { decimalOdds: 4.2 },
            },
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
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
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
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
                    name: "SC Ucha",
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
                          name: "SC Ucha v Astrumil",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "SC Ucha",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "Astrumil",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/6`,
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
        cardGroupTitle: "Fourth Card",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FOURTH_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FOURTH_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FOURTH_EVENT_ID}`,
                  home: {
                    name: "Braga",
                  },
                  away: {
                    name: "Benfica",
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
                      urn: `ppb:sbkMarket:${FOURTH_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Braga v Benfica",
                          urn: `ppb:event:${FOURTH_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/7`,
                          selectionId: 7,
                          name: "Braga",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/8`,
                          selectionId: 8,
                          name: "Benfica",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/7`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FOURTH_MARKET_ID}/8`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
      },
    },
  ],
};

const FIRST_RUNNER = {
  marketId: "924.1",
  selectionId: 1,
};

const TOKENS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
];

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
    },
  ],

  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
          decimalOdds: 2.23,
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
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_RUNNER = {
  marketId: "924.2",
  selectionId: 4,
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
    },
  ],

  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 1.2,
  winAverageOdds: 1.2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
          decimalOdds: 2.24,
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
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.2,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }],
  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 3 },
        },
        decimalDisplayOdds: {
          decimalOdds: 3,
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

const THIRD_RUNNER = {
  marketId: "924.3",
  selectionId: 5,
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],

  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 1.3,
  winAverageOdds: 1.3,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
          decimalOdds: 2.25,
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
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.3,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const FOURTH_RUNNER = {
  marketId: "924.4",
  selectionId: 7,
};

const FOURTH_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FOURTH_RUNNER],
    },
  ],

  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 1.4,
  winAverageOdds: 1.4,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.4,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
          decimalOdds: 2.26,
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
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.4,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM", "PRICE_BOOST"],
  legCombinations: [{ runners: [THIRD_RUNNER] }, { runners: [FOURTH_RUNNER] }],
  betMinStake: 0.05,
  betMaxStake: 1000,
  averageOdds: 1.3,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 1.3,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.3 } },
    decimalDisplayOdds: { decimalOdds: 1.3 },
  },
  tokens: {
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 3 },
        },
        decimalDisplayOdds: {
          decimalOdds: 3,
        },
      },
      maxStake: 10,
    })),
  },
};

const THIRD_SGM_MOCK = {
  betCombinations: [
    FIRST_DOUBLE_SGM,
    SECOND_DOUBLE_SGM,
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM"],
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }],
      legs: [{ leg: { betRunners: [{ runner: FIRST_RUNNER }] } }, { leg: { betRunners: [{ runner: SECOND_RUNNER }] } }],
      totalStake: 0.12,
      totalPotentialWin: 2.5,
      originalTotalPotentialWin: 0,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
      betType: "DOUBLE",
    },
    {
      betModifiers: ["SGM", "PRICE_BOOST"],
      runners: [{ runner: THIRD_RUNNER }, { runner: FOURTH_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: THIRD_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
        {
          leg: { betRunners: [{ runner: FOURTH_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 4,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalTotalPotentialWin: 2,
      betType: "DOUBLE",
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

describe("Bet Builder Error - non-combinable", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ oddsMovement: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("adding the first selection", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstSbkRunnerSO.element, "First bet button is not visible");
      await browser.waitUntilClickableNative(firstSbkRunnerSO.element);

      await firstSbkRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");
      await browser.waitUntilClickableNative(betslipDrawerSO.header);

      await betslipDrawerSO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");

      await swipeFromElementToElement(firstSbkRunnerSO.element, secondSbkRunnerSO.element);

      await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SGM_MOCK));
      await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
      await secondSbkRunnerSO.element.click();
    });

    describe("then adding another bet builder", () => {
      beforeAll(async () => {
        await swipeFromElementToElement(secondSbkRunnerSO.element, thirdSbkRunnerSO.element);
        await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK));
        await browser.waitUntilDisplayed(thirdSbkRunnerSO.element, "Third bet button is not visible");
        await browser.waitUntilClickableNative(thirdSbkRunnerSO.element);
        await thirdSbkRunnerSO.element.click();

        await swipeUpElement(firstSbkRunnerSO.element, 500);

        await browser.waitUntilClickableNative(fourthSbkRunnerSO.element);
        await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
        await fourthSbkRunnerSO.element.click();
      });

      describe("and has stake on both bet builders", () => {
        beforeAll(async () => {
          await minimizedSO.element.click();

          await browser.waitUntilClickableNative(firstBetBuilderStakeInputFieldSO.numberField);
          await firstBetBuilderStakeInputFieldSO.numberField.click();
          await firstBetBuilderStakeInputFieldSO.setValue(0.12);

          await swipeUpElement(sportsbookPlacePanelSO.element, 400);

          await browser.waitUntilClickableNative(secondBetBuilderStakeInputFieldSO.numberField);
          await secondBetBuilderStakeInputFieldSO.numberField.click();
          await secondBetBuilderStakeInputFieldSO.setValue(2);
        });

        describe("and the second bet build has the price boost button selected", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(secondGenerosityWalletButtonSO.element);
            await secondGenerosityWalletButtonSO.element.click();
            await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
            await firstExtraWalletCardOptionSO.checkbox.click();
            await generosityWalletApplyButtonSO.element.click();
            await swipeDownElement(sportsbookPlacePanelSO.element, 200);
          });

          it("[PRPI-3989] should display the price boost button in active state in the second bet builder", async () => {
            expect(await secondGenerosityWalletButtonSO.element.isEnabled()).toBe(true);
          });

          it("[PRPI-3990] should display the new total returns in the second bet builder", async () => {
            expect(await secondBetBuilderControlsSO.returnsLabel.getText()).toBe("Returns ");
            expect(await secondBetBuilderControlsReturnValuesSO.previousPnl.getText()).toBe("$2.60");
            expect(await secondBetBuilderControlsReturnValuesSO.pnl.getText()).toBe("$4.40");
          });

          describe("when the user places the bet", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
              await browser.waitUntilClickableNative(sportsbookPlacePanelSO.place);
              await sportsbookPlacePanelSO.place.click();
              await browser.waitUntilDisplayed(receiptPanelSO.element);

              await swipeUpElement(receiptPanelSO.element, 1200);
            });

            it("[PRPI-3991] should display the boost odds label on the second bet builder", async () => {
              expect(await firstOddsBoostAlertSO.message.getText()).toBe("Bet Boost Applied");
            });

            it("[PRPI-3991] should display the correct returns on the receipt panel", async () => {
              expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$6.50");
              expect(await betsSummarySO.previousTotalReturnsValue.getText()).toBe("$4.50");
            });
          });
        });
      });
    });
  });
});
