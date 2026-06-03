const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");
const MultiLinesMultiplesSO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.native.so");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  swipeUpElement,
  swipeUpElementFullscreen,
  hideKeyboard,
  swipeDownElement,
} = require("../../../../../helpers/gestures");

const {
  MinimizedSO,
  FreeBetsCardLabelSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  OptionSO,
  BetsSummarySO,
  FreeBetsSO,
  PNLAndWhatIfSO,
  BetSelectionDetailsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const thirdSportsbookMarketSO = new InlineSportsbookMarketSO(thirdCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[0]);
const thirdRunnerSO = new SportsbookBetButtonSO(thirdSportsbookMarketSO.sbkBetButtons[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multipleBetsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);
const oneLineMultipleSO = new OneLineMultipleSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(oneLineMultipleSO.element);
const multiplePNLAndWhatIfSO = new PNLAndWhatIfSO(multipleControlsSO.returnsValueContainer);
const multipleFreeBetsCardLabelSO = new FreeBetsCardLabelSO(multipleControlsSO.element);
const freeBetsSO = new FreeBetsSO();
const multiplesCardSO = new CardSO(sportsbookPlacePanelSO.collapsableSections[0]);

const multiLinesMultiplesSO = new MultiLinesMultiplesSO(sportsbookPlacePanelSO.element);
const firstMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[0]);
const doubleMultipleStakeFieldSO = new CurrencyNumberInputFieldSO(firstMultipleControlsSO.currencyInput);

const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const betSelectionDetailsSO = new BetSelectionDetailsSO(sportsbookReceiptPanelSO.element);
const trebleSummarySO = new BetsSummarySO();
const receiptMultipleFreeBetsSO = new FreeBetsSO(sportsbookReceiptPanelSO.multiples[0]);
const freeBetsOptionSO = new OptionSO(freeBetsSO.element);
const stakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const primaryButtonSO = new PrimaryButtonSO();

const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const SECOND_EVENT_ID = 29359891;
const THIRD_EVENT_ID = 29359892;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 1.5,
              },
            },
          },
        },
        {
          selectionId: 48054,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 2.5,
              },
            },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 1.2 } },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 2.7,
              },
            },
          },
        },
        {
          selectionId: 48351,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 1.5,
              },
            },
          },
        },
        {
          selectionId: 48051,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 2.5,
              },
            },
          },
        },
        {
          selectionId: 58801,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 1.2 } },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48352,
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 48042,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 1.5,
              },
            },
          },
        },
        {
          selectionId: 48052,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: {
                decimalOdds: 2.5,
              },
            },
          },
        },
        {
          selectionId: 58802,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 1.2 } },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48353,
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
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
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48054`,
                          selectionId: 48054,
                          name: "Sporting Too",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48054`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48351`,
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
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "2 Sporting",
                  },
                  away: {
                    name: "2 Man Utd",
                  },
                },
                sportevent: {
                  name: "2 Sporting v 2 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
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
                          name: "2 Sporting v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                          selectionId: 48041,
                          name: "2 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48051`,
                          selectionId: 48051,
                          name: "2 Sporting Too",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58801`,
                          selectionId: 58801,
                          name: "2 The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48352`,
                          selectionId: 48352,
                          name: "2 Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48051`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58801`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48352`,
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
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "3 Sporting",
                  },
                  away: {
                    name: "3 Man Utd",
                  },
                },
                sportevent: {
                  name: "3 Sporting v 3 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${THIRD_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
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
                          name: "3 Sporting v Man Utd",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48042`,
                          selectionId: 48042,
                          name: "3 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                          selectionId: 48052,
                          name: "3 Sporting Too",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58802`,
                          selectionId: 58802,
                          name: "3 The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48353`,
                          selectionId: 48353,
                          name: "3 Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48042`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58802`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48353`,
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
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
        quickLinksTitle: "Please Ignore",
        links: [
          {
            label: "Please Ignore",
            target: "_self",
            icon: null,
            viewLink: {
              viewUrl: "1",
            },
          },
        ],
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
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
      },
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 48044,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 48041,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 48041,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: THIRD_MARKET_ID,
          selectionId: 48042,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 48042,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
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
    },
    {
      betType: "PATENT",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 4.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 4.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 4.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 4.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      numLines: 7,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const PLACE_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 4 },
      },
      betType: "TREBLE",
      runners: [
        {
          runner: { marketId: FIRST_MARKET_ID, selectionId: 48044 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: { marketId: SECOND_MARKET_ID, selectionId: 48041 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: { marketId: THIRD_MARKET_ID, selectionId: 48042 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: FIRST_MARKET_ID, selectionId: 48044 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: SECOND_MARKET_ID, selectionId: 48041 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: THIRD_MARKET_ID, selectionId: 48042 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      wallets: [{ amount: 0.12, nonRedeemableAmount: 0.12, type: "BONUS_CASH" }],
      totalStake: 0.12,
      totalPotentialWin: 0.36,
    },
  ],
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

describe("[848998] Place a multiple bet with bonus", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("[848998] when user adds three selections to the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await swipeUpElement(firstRunnerSO.element);
      await secondRunnerSO.element.click();
      await swipeUpElement(secondRunnerSO.element);
      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
      await thirdRunnerSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "3");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(oneLineMultipleSO.element, "One Line multiple was not displayed");
    });

    it("[PRPI-3470] The free bets icon should be displayed", async () => {
      expect(await freeBetsSO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3471] The free bets text should be 'Use Free Bet Balance'", async () => {
      expect(await freeBetsSO.label.getText()).toEqual("Use Free Bet Balance");
    });

    it("[PRPI-3472] The free bets should be unselected", async () => {
      expect(await freeBetsOptionSO.checkbox.getAttribute("selected")).toBe("false");
    });

    it("[PRPI-4118] should display 'Balance After Bet' with the correct value", async () => {
      expect(await multipleBetsSummarySO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await multipleBetsSummarySO.leftSegmentValue.getText()).toBe("$123.00");
    });

    describe("[848998] when user adds a stake value $0.12 to the multiple", () => {
      beforeAll(async () => {
        await stakeInputFieldSO.setValue(0.12);
        await hideKeyboard();
        await swipeDownElement(sportsbookPlacePanelSO.element);
        await browser.waitUntilDisplayed(multiplePNLAndWhatIfSO.pnl, "The returns are not displayed");
      });

      it("[PRPI-3473] The returns should be displayed", async () => {
        expect(await multiplePNLAndWhatIfSO.pnl.isDisplayed()).toBe(true);
      });

      describe("[848998] when the user selects the freebets", () => {
        beforeAll(async () => {
          await freeBetsOptionSO.checkbox.click();
          await browser.waitUntil(async () => (await freeBetsOptionSO.checkbox.getAttribute("selected")) === "true");
        });

        it("[PRPI-3474] The component should be selected", async () => {
          expect(await freeBetsOptionSO.checkbox.getAttribute("selected")).toBe("true");
        });

        it("[PRPI-3475] The returns should be updated", async () => {
          expect(await multiplePNLAndWhatIfSO.pnl.getText()).toEqual("$0.13");
        });

        it("[PRPI-3476] The multiple with bonus should not show 'Bonus not available'", async () => {
          expect(await multipleFreeBetsCardLabelSO.label.isDisplayed()).toEqual(false);
        });

        it("[PRPI-4119] should display 'Balance After Bet' with 'N/A'", async () => {
          expect(await multipleBetsSummarySO.leftSegmentValue.getText()).toBe("N/A");
        });

        describe("[848998] when the user the additional multiple Double which has no bonus", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(multiplesCardSO.header);
            await multiplesCardSO.header.click();
            await browser.waitUntilClickableNative(doubleMultipleStakeFieldSO.element);
            await doubleMultipleStakeFieldSO.element.click();
          });

          it("[PRPI-3477] The 'Bonus not available' should be displayed", async () => {
            expect(await multipleFreeBetsCardLabelSO.label.getText()).toEqual("Bonus not available");
          });

          describe("[848998] when the user press confirm bet button", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS));
              await primaryButtonSO.element.click();
              await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Receipt panel was not displayed");
              await swipeUpElementFullscreen(betSelectionDetailsSO.title);
              await browser.waitUntilDisplayed(
                receiptMultipleFreeBetsSO.element,
                "The Free Bets element is not displayed",
              );
            });

            it("[PRPI-3477] The free bets icon should be displayed", async () => {
              expect(await receiptMultipleFreeBetsSO.icon.isDisplayed()).toEqual(true);
            });

            it("[PRPI-3477] The free bets 'Using $0.12 Free Bet' text should be displayed", async () => {
              expect(await receiptMultipleFreeBetsSO.label.getText()).toEqual("Used $0.12 Free Bet");
            });

            it("[PRPI-3477] The potential returns should be the updated value", async () => {
              expect(await trebleSummarySO.totalReturnsValue.getText()).toEqual("$0.36");
            });
          });
        });
      });
    });
  });
});
