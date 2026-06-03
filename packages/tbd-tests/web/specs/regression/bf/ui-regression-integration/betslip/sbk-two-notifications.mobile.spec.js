const {
  MinimizedPO,
  CompetitionPagePO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  AlertPO,
  PrimaryButtonPO,
  AlertsPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

// page
const competitionPage = new CompetitionPagePO();
const sportsbookMinimizedBetslip = new MinimizedPO();
// page markets
const eventMarketsCardCoupon = new CouponCardGroupPO(competitionPage.element);
const inlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[0]);
const firstRunnerButton = new SportsbookBetButtonPO(inlineSportsbookMarket.betButtons[0]);
const secondInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[1]);
const secondRunnerButton = new SportsbookBetButtonPO(secondInlineSportsbookMarket.betButtons[0]);
const thirdInlineSportsbookMarket = new InlineSportsbookMarketPO(eventMarketsCardCoupon.eventCoupons[2]);
const thirdRunnerButton = new SportsbookBetButtonPO(thirdInlineSportsbookMarket.betButtons[0]);
// betslip
const betslipDrawerPO = new BetslipDrawerPO();
const sbkPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sbkPlacePanelPO.place);
const placeMultipleControlsPO = new BetControlsPO(sbkPlacePanelPO.element);
const placeMultipleStakeFieldPO = new CurrencyNumberInputFieldPO(placeMultipleControlsPO.currencyInput);

const COMPETITION_ID = "228";
const FIRST_MARKET_ID = "924.1";
const FIRST_SELECTION_ID = 1;
const SECOND_MARKET_ID = "924.2";
const SECOND_SELECTION_ID = 2;
const THIRD_MARKET_ID = "924.3";
const THIRD_SELECTION_ID = 3;

const BFF_MOCK = {
  urn: "ppb:tbd:view:competition:228",
  url: routes.getCompetitionViewUrl(COMPETITION_ID),
  competition: {
    urn: "ppb:competition:228",
    name: "UEFA Champions League",
    competitionId: COMPETITION_ID,
  },
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
        filteredCouponTitle: "UEFA Champions League",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899897",
                  viewUrl: routes.getEventViewUrl("29899897"),
                },
                title: "Match Odds",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899897",
                          name: "Man City v Real Madrid",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}`,
                          name: "Man City",
                          selectionId: FIRST_SELECTION_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2426`,
                          name: "Real Madrid",
                          selectionId: 2426,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2426` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899897",
                  home: { name: "Man City" },
                  away: { name: "Real Madrid" },
                  scheduledAt: "2020-08-07T19:00:00Z",
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
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899869",
                  viewUrl: routes.getEventViewUrl("29899869"),
                },
                title: "Match Odds",
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
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: 228,
                        },
                        sportevent: {
                          urn: "ppb:event:29899869",
                          name: "Juventus v Lyon",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}`,
                          name: "Juventus",
                          selectionId: SECOND_SELECTION_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/55271`,
                          name: "Lyon",
                          selectionId: 55271,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}` },
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/55271` },
                      { runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899869",
                  home: { name: "Juventus" },
                  away: { name: "Lyon" },
                  scheduledAt: "2020-08-07T19:00:00Z",
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899863",
                  viewUrl: routes.getEventViewUrl("29899863"),
                },
                title: "Match Odds",
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
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899863",
                          name: "Bayern Munich v Chelsea",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/${THIRD_SELECTION_ID}`,
                          name: "Bayern Munich",
                          selectionId: THIRD_SELECTION_ID,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/55190`,
                          name: "Chelsea",
                          selectionId: 55190,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58805`,
                          name: "The Draw",
                          selectionId: 58805,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/${THIRD_SELECTION_ID}` },
                      { runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/55190` },
                      { runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58805` },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899863",
                  home: { name: "Bayern Munich" },
                  away: { name: "Chelsea" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899864",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899864",
                  viewUrl: routes.getEventViewUrl("29899864"),
                },
                title: "Match Odds",
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
                      urn: "ppb:sbkMarket:924.3234184336",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          urn: "ppb:competition:228",
                          name: "UEFA Champions League",
                          competitionId: COMPETITION_ID,
                        },
                        sportevent: {
                          urn: "ppb:event:29899864",
                          name: "AD Marco 09 v Lixa",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184336/58810",
                          name: "AD Marco 09",
                          selectionId: 58810,
                          resultType: "HOME",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184336/58811",
                          name: "Lixa",
                          selectionId: 58811,
                          resultType: "AWAY",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3234184336/58812",
                          name: "The Draw",
                          selectionId: 58812,
                          resultType: "DRAW",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3234184336/58810" },
                      { runnerURN: "ppb:sbkRunner:924.3234184336/58811" },
                      { runnerURN: "ppb:sbkRunner:924.3234184336/58812" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29899864",
                  home: { name: "AD Marco 09" },
                  away: { name: "Lixa" },
                  scheduledAt: "2020-08-08T19:00:00Z",
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899869",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29899864",
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:228",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58807,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: THIRD_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58806,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3234184336",
      runnerDetails: [
        {
          selectionId: 58810,
          noOdds: true,
        },
        {
          selectionId: 58811,
          noOdds: true,
        },
        {
          selectionId: 58812,
          noOdds: true,
        },
      ],
    },
  ],
};

// add first selection
const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: FIRST_SELECTION_ID,
        },
      ],
    },
  ],

  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};
const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: FIRST_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};
const SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

// add second selection
const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  averageOdds: 3,
  winAverageOdds: 3,
  betType: "SINGLE",
};
const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: SECOND_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const DOUBLE_1LINE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 6.3,
  winAverageOdds: 6.3,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 6.3 } },
    decimalDisplayOdds: { decimalOdds: 6.3 },
  },
  betType: "DOUBLE",
};
const DOUBLE_MOCK = {
  betCombinations: [FIRST_COMBINATION, SECOND_COMBINATION, DOUBLE_1LINE_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS],
};

// add third selection
const THIRD_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  averageOdds: 3,
  winAverageOdds: 3,
  betType: "SINGLE",
};
const THIRD_COMBINATION_ODDS = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: THIRD_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};
const DOUBLE_2LINE_COMBINATIONS = {
  ...DOUBLE_1LINE_COMBINATION,
  numLines: 3,
  averageOdds: 13,
  winAverageOdds: 13,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 13 } },
    decimalDisplayOdds: { decimalOdds: 13 },
  },
};
const TREBLE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 18.9,
  winAverageOdds: 18.9,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 18.9 } },
    decimalDisplayOdds: { decimalOdds: 18.9 },
  },
  betMaxStake: 300,
  betType: "TREBLE",
};
const TREBLE_MOCK = {
  betCombinations: [
    FIRST_COMBINATION,
    SECOND_COMBINATION,
    THIRD_COMBINATION,
    TREBLE_COMBINATION,
    DOUBLE_2LINE_COMBINATIONS,
  ],

  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
};

const SMP_MOCK_ODDS_MOVEMENT = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4 },
            },
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
        {
          selectionId: 58807,
          noOdds: true,
        },
        {
          selectionId: 2426,
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58805,
          noOdds: true,
        },
        {
          selectionId: 55271,
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: THIRD_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
        {
          selectionId: 58806,
          noOdds: true,
        },
        {
          selectionId: 55190,
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3234184336",
      runnerDetails: [
        {
          selectionId: 58810,
          noOdds: true,
        },
        {
          selectionId: 58811,
          noOdds: true,
        },
        {
          selectionId: 58812,
          noOdds: true,
        },
      ],
    },
  ],
};

// odd change
const FIRST_COMBINATION_MOVEMENT = {
  ...FIRST_COMBINATION,
  averageOdds: 4,
  winAverageOdds: 4,
};
const FIRST_COMBINATION_ODDS_MOVEMENT = {
  ...FIRST_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 4 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};
const DOUBLE_MOVEMENT = {
  ...DOUBLE_2LINE_COMBINATIONS,
  averageOdds: 6.3,
  winAverageOdds: 6.3,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 6.3 } },
    decimalDisplayOdds: { decimalOdds: 6.3 },
  },
};
const TREBLE_MOVEMENT = {
  ...TREBLE_COMBINATION,
  averageOdds: 21,
  winAverageOdds: 21,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 21 } },
    decimalDisplayOdds: { decimalOdds: 21 },
  },
};
const FIRST_ODDS_MOVEMENT_MOCK = {
  betCombinations: [
    FIRST_COMBINATION_MOVEMENT,
    SECOND_COMBINATION,
    THIRD_COMBINATION,
    TREBLE_MOVEMENT,
    DOUBLE_MOVEMENT,
  ],

  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
};

// SPB fail place bet
const SPB_FAIL_MOCK = {
  result: [
    {
      runners: [],
      legs: [],
      resultCode: "INSUFFICIENT_FUNDS",
    },
  ],

  respCode: "BET_PLACEMENT_FAILURE",
};

describe("Betslip SBK", () => {
  const getNotifications = () => {
    const placeAlerts = new AlertsPO(sbkPlacePanelPO.element);
    const firstAlert = new AlertPO(placeAlerts.items[0]);
    const secondAlert = new AlertPO(placeAlerts.items[1]);

    return {
      firstAlert,
      secondAlert,
    };
  };

  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getEventViewUrl(COMPETITION_ID)}`);
    await browser.waitUntilEquals(firstRunnerButton.odd, "2.1");

    // add first selection
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await firstRunnerButton.element.click();
    await browser.waitUntilDisplayed(sbkPlacePanelPO.element);

    // close betslip
    await betslipDrawerPO.header.click();
    await browser.waitUntilNotDisplayed(sbkPlacePanelPO.element, "Single panel hasn't been minimized");

    // add second selection
    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("Double @");
      },
      {
        timeoutMsg: "2 Leg multiple was not combined",
      },
    );

    // add third selection
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
    await thirdRunnerButton.element.click();
    await browser.waitUntil(
      async () => {
        const title = await sportsbookMinimizedBetslip.title.getText();
        return title.includes("Treble @");
      },
      {
        timeoutMsg: "3 Leg multiple was not combined",
      },
    );

    // open betslip
    await sportsbookMinimizedBetslip.element.waitForClickable();
    await sportsbookMinimizedBetslip.element.click();
    await browser.waitUntilDisplayed(sbkPlacePanelPO.element, "Place panel hasn't been expanded");
  });

  describe("error and warning notifications", () => {
    describe("when 1st selection odds changes", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getMarketPrices(SMP_MOCK_ODDS_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_ODDS_MOVEMENT_MOCK));
        await browser.tickFakeClock();

        const { firstAlert } = getNotifications();
        await browser.waitUntilEquals(firstAlert.message, "Odds have changed");
      });

      it("[PRPI-6396] should display odds changed notification", async () => {
        const { firstAlert } = getNotifications();

        expect(await firstAlert.message.getText()).toBe("Odds have changed");
      });

      describe("when user tries to place a bet with unsufficient funds", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(SPB_FAIL_MOCK));
          await browser.waitUntilDisplayed(placeMultipleStakeFieldPO.element);

          await placeMultipleStakeFieldPO.numberField.waitForClickable();
          await placeMultipleStakeFieldPO.numberField.click();
          await placeMultipleStakeFieldPO.setValue("50");
          await browser.waitUntilEquals(placeMultipleStakeFieldPO.numberField, "50");
          await placeButtonPO.element.click();

          const { firstAlert } = getNotifications();

          await browser.waitUntilEquals(firstAlert.message, "Not enough money in your main wallet.");
        });

        it("[PRPI-6397] should display first notification with place error notification", async () => {
          const { firstAlert } = getNotifications();

          expect(await firstAlert.message.getText()).toBe("Not enough money in your main wallet.");
        });

        it("[PRPI-6398] should display second notification with odds changed notification", async () => {
          const { secondAlert } = getNotifications();

          expect(await secondAlert.message.getText()).toBe("Odds have changed");
        });
      });
    });
  });
});
