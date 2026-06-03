const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MultiLinesMultiplesSO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.native.so");
const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");

const { swipeUp, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  CardSO,
  SportsbookBetButtonSO,
  InlineSportsbookMarketSO,
  PrimaryButtonSO,
  BetslipDrawerSO,
  MinimizedSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetSegmentsSO,
  BetSummarySO,
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

const oneLineMultipleSO = new OneLineMultipleSO(sportsbookPlacePanelSO.element);
const multiLinesMultiplesSO = new MultiLinesMultiplesSO(sportsbookPlacePanelSO.element);
const firstMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[0]);
const secondMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[1]);
const thirdMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[2]);

const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const sportsbookMultiplesControlsSO = new BetControlsSO(sportsbookPlacePanelSO.element);
const trebleMultipleStakeFieldSO = new CurrencyNumberInputFieldSO(sportsbookMultiplesControlsSO.currencyInput);
const doubleMultipleStakeFieldSO = new CurrencyNumberInputFieldSO(firstMultipleControlsSO.currencyInput);
const primaryButtonSO = new PrimaryButtonSO();
const firstBetSummarySO = new BetSummarySO(sportsbookReceiptPanelSO.multiples[0]);
const firstBetSegmentSO = new BetSegmentsSO(firstBetSummarySO.element);
const secondBetSummarySO = new BetSummarySO(sportsbookReceiptPanelSO.multiples[1]);
const secondBetSegmentSO = new BetSegmentsSO(secondBetSummarySO.element);

const EVENT_TYPE_ID = 1;

const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const THIRD_EVENT_ID = 3;

const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
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
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
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
        },
        {
          selectionId: "6",
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
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
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
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
                  name: "Sporting v West Ham",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
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
                    name: "Porto",
                  },
                  away: {
                    name: "West Ham",
                  },
                },
                sportevent: {
                  name: "Porto v West Ham",
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
                    name: "Ermesinde",
                  },
                  away: {
                    name: "Astrumil",
                  },
                },
                sportevent: {
                  name: "Ermesinde v Astrumil",
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
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      canPlaceEachwayBet: true,
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
      winAverageOdds: 2.1,
      betMinStakeIncrement: 0.01,
      canPlaceEachwayBet: true,
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

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const PLACE_SUCCESS = {
  result: [
    {
      numLines: 3,
      totalStake: 0.6,
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          runner: { marketId: "924.2", selectionId: 4 },
        },
        {
          runner: { marketId: "924.3", selectionId: 7 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.3", selectionId: 7 } }],
          },
          winOdds: {},
        },
      ],

      totalPotentialWin: 2.31,
    },
    {
      numLines: 1,
      totalStake: 0.1,
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          runner: { marketId: "924.2", selectionId: 4 },
        },
        {
          runner: { marketId: "924.3", selectionId: 7 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {},
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.3", selectionId: 7 } }],
          },
          winOdds: {},
        },
      ],

      totalPotentialWin: 0.72,
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 7.18 },
      },
    },
  ],
};

describe("betslip - multiples bet types", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When user adds first selection to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
    });

    describe("When user adds second selection to the betslip", () => {
      beforeAll(async () => {
        await swipeUp(0.9); // display both second and third card
        await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
        await browser.waitUntilDisplayed(secondRunnerSO.element);
        await secondRunnerSO.element.click();
      });

      describe("When user adds third selection to the betslip", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
          await browser.waitUntilDisplayed(thirdRunnerSO.element);
          await thirdRunnerSO.element.click();

          await browser.waitUntilClickableNative(minimizedSO.element);
          await minimizedSO.element.click();
          await browser.waitUntilDisplayed(
            sportsbookPlacePanelSO.element,
            "Waiting for Sportsbook place panel element",
          );

          await trebleMultipleStakeFieldSO.numberField.setValue(0.1); // Treble stake
          await hideKeyboard();
        });

        it("[PRPI-3341] should open betslip multiples panel", async () => {
          expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-3342] And I should see 'ADDITIONAL MULTIPLES' title visible on the accordion", async () => {
          expect(await sportsbookPlacePanelSO.collapsableSections[1].title.getText()).toBe("ADDITIONAL MULTIPLES");
        });

        it("[PRPI-4233] And I should see 4 bet types multi-combination available: 'Trebble', 'Double (x3)', 'Trixie (x4)', 'Patent (x7)' expanded by default", async () => {
          expect(await oneLineMultipleSO.text.getText()).toBe("Treble");

          await swipeUp(0.65); // display Additional Multiples
          await browser.waitUntilDisplayed(thirdMultipleControlsSO.lines);

          expect(await multiLinesMultiplesSO.element.isDisplayed()).toBe(true);

          expect(await multiLinesMultiplesSO.multiples.length).toBe(3);

          expect(await firstMultipleControlsSO.lines.getText()).toBe("Double (x3)");
          expect(await secondMultipleControlsSO.lines.getText()).toBe("Trixie (x4)");
          expect(await thirdMultipleControlsSO.lines.getText()).toBe("Patent (x7)");
        });

        it("[PRPI-3343] And I should see 'Each Way' edge visible for 'Double (x3)'", async () => {
          expect(await firstMultipleControlsSO.eachWay.isDisplayed()).toBe(true);
        });

        it("[PRPI-3344] And I should see the 'Returns' label and value '0.00' visible", async () => {
          expect(await firstMultipleControlsSO.returns.getText()).toBe("Returns $0.00");
        });

        describe("When I tap 'Additional multiple' accordion", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(sportsbookPlacePanelSO.collapsableSections[1].title);
            await sportsbookPlacePanelSO.collapsableSections[1].title.click();
            await browser.waitUntilNotInDOM(multiLinesMultiplesSO.multiples[0]);
          });

          afterAll(async () => {
            await browser.waitUntilClickableNative(sportsbookPlacePanelSO.collapsableSections[1].title);
            await sportsbookPlacePanelSO.collapsableSections[1].title.click();
            await browser.waitUntilDisplayed(multiLinesMultiplesSO.multiples[0]);
          });

          it("[PRPI-3345] Should close 'Additional multiple' section", async () => {
            expect(await multiLinesMultiplesSO.multiples[0].isDisplayed()).toBe(false);
          });
        });

        describe("when the user places a multiple", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS));
            await doubleMultipleStakeFieldSO.numberField.setValue(0.2); // Double stake
            await hideKeyboard();
            await browser.waitUntilDisplayed(primaryButtonSO.element);

            await primaryButtonSO.element.click();
            await browser.waitUntilDisplayed(
              sportsbookReceiptPanelSO.element,
              "Waiting for Sportsbook confirm panel element",
            );
          });
          it("[PRPI-3346] should show bet type for first bet", async () => {
            expect(await firstBetSummarySO.title.getText()).toBe("Double");
          });

          it("[PRPI-3347] should show odds info for first bet", async () => {
            expect(await firstBetSegmentSO.leftLabel.getText()).toBe("Odds");
            expect(await firstBetSegmentSO.leftValue.getText()).toBe("7.18");
          });

          it("[PRPI-3346] should show bet type for second bet", async () => {
            expect(await secondBetSummarySO.title.getText()).toBe("Treble");
          });

          it("[PRPI-3348] should show number of lines value of 3 for second bet", async () => {
            expect(await secondBetSegmentSO.leftLabel.getText()).toBe("Lines");
            expect(await secondBetSegmentSO.leftValue.getText()).toBe("3");
          });
        });
      });
    });
  });
});
