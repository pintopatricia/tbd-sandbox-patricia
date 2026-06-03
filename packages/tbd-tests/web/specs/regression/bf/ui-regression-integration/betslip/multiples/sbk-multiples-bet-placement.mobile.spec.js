const {
  MinimizedPO,
  SportsbookReceiptPanelPO,
  SportPagePO,
  CardPO,
  BetControlsPO,
  BetSelectionsPO,
  BetsSummaryPO,
  BetSegmentsPO,
  BetSummaryPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  PrimaryButtonPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const thirdEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[2]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const thirdMatchOddsCard = new CardPO(thirdEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const thirdSbkMarketPO = new InlineSportsbookMarketPO(thirdMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(thirdSbkMarketPO.betButtons[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const firstSportsbookMultiplesCombinationSummaryPO = new BetSummaryPO(sportsbookReceiptPanelPO.multiples[0]);
const firstSportsbookMultiplesCombinationBetSegmentsPO = new BetSegmentsPO(
  firstSportsbookMultiplesCombinationSummaryPO.element,
);
const secondSportsbookMultiplesCombinationSummaryPO = new BetSummaryPO(sportsbookReceiptPanelPO.multiples[1]);
const secondSportsbookMultiplesCombinationBetSegmentsPO = new BetSegmentsPO(
  secondSportsbookMultiplesCombinationSummaryPO.element,
);
const betsSummaryPO = new BetsSummaryPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.placeBet);
const betSelectionsPO = new BetSelectionsPO(sportsbookReceiptPanelPO.element);
const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const stakeFieldPO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);

const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const firstAdditionalMultipleControlsPO = new BetControlsPO(multiLinesMultiplesPO.multiples[0]);
const firstAdditionalMultipleStakeInputFieldPO = new CurrencyNumberInputFieldPO(
  firstAdditionalMultipleControlsPO.currencyInput,
);

const betslipDrawerPO = new BetslipDrawerPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: "7",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "8",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "9",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B ",
                  urn: "ppb:event:29359895",
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
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
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
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
                  },
                },
                sportevent: {
                  name: "Team A 2 vs Team B 2",
                  urn: "ppb:event:29359896",
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
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/4",
                          selectionId: 4,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/5",
                          selectionId: 5,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/6",
                          selectionId: 6,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/4" },
                      { runnerURN: "ppb:sbkRunner:924.2/5" },
                      { runnerURN: "ppb:sbkRunner:924.2/6" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team B 3",
                  },
                  away: {
                    name: "Team A 3",
                  },
                },
                sportevent: {
                  name: "Team A 3 vs Team B 3",
                  urn: "ppb:event:29359897",
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
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/7",
                          selectionId: 7,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/8",
                          selectionId: 8,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/9",
                          selectionId: 9,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/7" },
                      { runnerURN: "ppb:sbkRunner:924.3/8" },
                      { runnerURN: "ppb:sbkRunner:924.3/9" },
                    ],
                  },
                },
              },
            },
          ],
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
          marketId: "924.1",
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
};

const FIRST_SINGLE_ODDS_MOCK = {
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
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 4,
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
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.3",
          selectionId: 7,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.3",
    selectionId: 7,
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
          decimalOdds: 3.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
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
      numLines: 3,
    },
    {
      betType: "TRIXIE",
      legCombinations: [],
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
      numLines: 4,
    },
    {
      betType: "PATENT",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 155.52,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 155.52 },
        },
        fractionalDisplayOdds: { numerator: 156.52, denominator: 1 },
      },
      numLines: 7,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK_SUCCESS_TREBLE = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: "924.2", selectionId: 4 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: "924.3", selectionId: 7 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

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
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.3", selectionId: 7 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 2,
      totalPotentialWin: 4,
    },
  ],
};

const SPB_MOCK_SUCCESS_DOUBLE_TREBLE = {
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

describe("Sportsbook place bet button", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS_TREBLE));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
    await firstSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");
    await betslipDrawerPO.header.click();
    await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");

    await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondSbkRunnerPO.sportsbookBetButton.click();

    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslipPO.title.getText();

        return title.includes("2.4");
      },
      {
        timeoutMsg: "2 Leg multiple was not combined",
      },
    );

    await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");

    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
    await thirdSbkRunnerPO.sportsbookBetButton.click();

    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslipPO.title.getText();

        return title.includes("3.1");
      },
      {
        timeoutMsg: "3 Leg multiple was not combined",
      },
    );

    await sportsbookMinimizedBetslipPO.element.waitForClickable();
    await sportsbookMinimizedBetslipPO.element.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples place panel couldn't be opened");
  });

  describe("when there is no value in a stake input field", () => {
    it("[PRPI-7976] should disable the place bet button", async () => {
      expect(await placeButtonPO.element.isEnabled()).toBe(false);
    });

    describe("when I input 2 on the size input field", () => {
      beforeAll(async () => {
        await stakeFieldPO.setValue("2");
      });

      it("[PRPI-7977] should enable the place bet button", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });

      describe("when I press Place bet button and it is successful", () => {
        beforeAll(async () => {
          await placeButtonPO.element.click();

          await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element);
        });

        it("[PRPI-7978] should hide the multiples place panel", async () => {
          expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(false);
        });
      });
    });
  });
});

describe("Sportsbook multiples receipt panel", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        currencyCode: "USD",
        localeCodeBcp47: "en-US",
      }),
    );
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS_DOUBLE_TREBLE));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

    await browser.url(`${routes.getEventViewUrl(EVENT_TYPE_ID)}`);
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
    await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

    await firstSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");

    await betslipDrawerPO.header.click();
    await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");

    await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondSbkRunnerPO.sportsbookBetButton.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslipPO.title.getText();

        return title.includes("2.4");
      },
      {
        timeoutMsg: "2 Leg multiple was not combined",
      },
    );

    await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");

    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
    await thirdSbkRunnerPO.sportsbookBetButton.click();

    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslipPO.title.getText();

        return title.includes("3.1");
      },
      {
        timeoutMsg: "3 Leg multiple was not combined",
      },
    );

    await sportsbookMinimizedBetslipPO.element.waitForClickable();
    await sportsbookMinimizedBetslipPO.element.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples place panel couldn't be opened");
  });

  describe("when placing a bet with 3 selections", () => {
    beforeAll(async () => {
      await stakeFieldPO.element.waitForClickable();
      await stakeFieldPO.setValue("0.12");

      await firstAdditionalMultipleStakeInputFieldPO.element.waitForClickable();
      await firstAdditionalMultipleStakeInputFieldPO.setValue("0.2");

      await placeButtonPO.element.click();

      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element, "Receipt hasn't been shown");
    });

    it("[PRPI-7979] should display the bet receipt", async () => {
      expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-7980] should have the 'Bet Placed' information", async () => {
      expect(await betslipDrawerPO.header.getText()).toContain("Bet Placed");
    });

    it("[PRPI-7981] should expand the collapse", async () => {
      expect(await betSelectionsPO.content.isDisplayed()).toBe(true);
    });

    it("[PRPI-7982] should show 3 selections", async () => {
      expect(await betSelectionsPO.selections.length).toBe(3);
    });

    it("[PRPI-7983] should have bet type information", async () => {
      expect(await firstSportsbookMultiplesCombinationSummaryPO.title.getText()).toBe("Double");
    });

    it("[PRPI-7984] should have odds label", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.leftLabel.getText()).toBe("Odds");
    });

    it("[PRPI-7985] should have odds value", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.leftValue.getText()).toBe("7.18");
    });

    it("[PRPI-7986] should have stake label", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.midLabel.getText()).toBe("Stake");
    });

    it("[PRPI-7987] should have stake value", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.midValue.getText()).toBe("$0.10");
    });

    it("[PRPI-7988] should have returns label", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.rightLabel.getText()).toBe("Returns");
    });

    it("[PRPI-7989] should have returns value", async () => {
      expect(await firstSportsbookMultiplesCombinationBetSegmentsPO.rightValue.getText()).toBe("$0.72");
    });

    it("[PRPI-8635] should have bet type information 'Treble'", async () => {
      expect(await secondSportsbookMultiplesCombinationSummaryPO.title.getText()).toBe("Treble");
    });

    it("[PRPI-7990] should have lines label", async () => {
      expect(await secondSportsbookMultiplesCombinationBetSegmentsPO.leftLabel.getText()).toBe("Lines");
    });

    it("[PRPI-7991] should have lines value", async () => {
      expect(await secondSportsbookMultiplesCombinationBetSegmentsPO.leftValue.getText()).toBe("3");
    });

    it("[PRPI-7992] should have a total stake label", async () => {
      expect(await betsSummaryPO.leftSegmentLabel.getText()).toBe("Total Stake");
    });

    it("[PRPI-7993] should have a total stake value", async () => {
      expect(await betsSummaryPO.leftSegmentValue.getText()).toBe("$0.70");
    });

    it("[PRPI-7994] should have a total returns label", async () => {
      expect(await betsSummaryPO.totalReturnsLabel.getText()).toBe("Total Returns");
    });

    it("[PRPI-7995] should have a total returns value", async () => {
      expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$3.03");
    });

    describe("when I click on the selections header", () => {
      beforeAll(async () => {
        await betSelectionsPO.header.click();
      });

      it("[PRPI-7996] should have a collapsed collapse with 3 selections", async () => {
        // Collapse component when collapsed, removes content from DOM
        expect(await betSelectionsPO.selections.length).toBe(0);
        expect(await betSelectionsPO.headerTitle.getText()).toEqual("3 Selections");
      });
    });
  });
});
