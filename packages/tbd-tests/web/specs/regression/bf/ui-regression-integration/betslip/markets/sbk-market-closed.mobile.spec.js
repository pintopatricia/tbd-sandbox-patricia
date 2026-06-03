const {
  CompetitionPagePO,
  MinimizedPO,
  SinglesCardPO,
  SinglePO,
  BetLegsPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  BetSelectionDetailsPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  AlertPO,
  HintPO,
  SportsbookPlacePanelPO,
  PrimaryButtonPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

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
const sbkPlacePanel = new SportsbookPlacePanelPO();
// place panel: singles
const placePanelSingles = new SinglesCardPO(sbkPlacePanel.element);
const placePanel1stSingle = new SinglePO(placePanelSingles.singles[0]);
const placePanel1stSingleHint = new HintPO(placePanel1stSingle.element);
const placePanel1stSingleControls = new BetControlsPO(placePanel1stSingle.element);
const placePanel1stSingleStakeField = new CurrencyNumberInputFieldPO(placePanel1stSingleControls.currencyInput);
// place panel: multiples
const placeMultipleControls = new BetControlsPO(sbkPlacePanel.element);
const placeMultipleStakeField = new CurrencyNumberInputFieldPO(placeMultipleControls.currencyInput);
const placeMultipleOddsField = new FixedNumberInputFieldPO(placeMultipleControls.fixedInput);
const placeMultiplesBetLegs = new BetLegsPO(sbkPlacePanel.element);
const placeMultiples1stSelection = new BetSelectionDetailsPO(placeMultiplesBetLegs.selections[0]);
const placeButton = new PrimaryButtonPO(sbkPlacePanel.place);

// place panel: footer
const placeAlert = new AlertPO(sbkPlacePanel.element);

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
                  name: "Man City v Real Madrid",
                  urn: "ppb:event:29359899",
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
                sportevent: {
                  name: "Juventus v Lyon",
                  urn: "ppb:event:29899869",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29899863",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899863",
                  viewUrl: routes.getEventViewUrl("29899863"),
                },
                title: "Match Odds",
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
                sportevent: {
                  name: "Bayern Munich v Chelsea",
                  urn: "ppb:event:29899863",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29899864",
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:29899864",
                  viewUrl: routes.getEventViewUrl("29899864"),
                },
                title: "Match Odds",
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
                sportevent: {
                  name: "AD Marco 09 v Lixa",
                  urn: "ppb:event:29899864",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
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

const SMP_MOCK_FIRST_MARKET_CLOSED = {
  markets: [
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

// first selection market closes
const FIRST_MARKET_CLOSED_MOCK = {
  betCombinations: [SECOND_COMBINATION, THIRD_COMBINATION, DOUBLE_1LINE_COMBINATION],
  runnerOdds: [SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const SMP_MOCK_FIRST_MARKET_MOVEMENT = {
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

// first odd change
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
  ...DOUBLE_1LINE_COMBINATION,
  averageOdds: 6.3,
  winAverageOdds: 6.3,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 6.3 } },
    decimalDisplayOdds: { decimalOdds: 6.3 },
  },
};
const FIRST_ODDS_MOVEMENT_MOCK = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT, SECOND_COMBINATION, DOUBLE_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
};

const SMP_MOCK_SECOND_MARKET_CLOSED = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      marketStatus: "CLOSED",
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
      marketStatus: "CLOSED",
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

const SMP_MOCK_THIRD_MARKET_CLOSED = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      marketStatus: "CLOSED",
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
      marketStatus: "CLOSED",
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
      marketStatus: "CLOSED",
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

// 2nd selection market closed
const SECOND_MARKET_CLOSED_MOCK = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
    {
      failedRunner: {
        marketId: SECOND_MARKET_ID,
        selectionId: SECOND_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

// 3rd selection market closed
const THIRD_MARKET_CLOSED_MOCK = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS, THIRD_COMBINATION_ODDS],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
    {
      failedRunner: {
        marketId: SECOND_MARKET_ID,
        selectionId: SECOND_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
    {
      failedRunner: {
        marketId: THIRD_MARKET_ID,
        selectionId: THIRD_SELECTION_ID,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

describe("Sportsbook Market Closed", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(routes.getCompetitionViewUrl(COMPETITION_ID));
    await browser.waitUntilEquals(firstRunnerButton.odd, "2.1");

    // add first selection
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await firstRunnerButton.element.scrollIntoView({
      block: "center",
    });
    await firstRunnerButton.element.click();
    await browser.waitUntilDisplayed(sbkPlacePanel.element);

    // close betslip
    await betslipDrawerPO.header.click();
    await browser.waitUntilNotDisplayed(sbkPlacePanel.element, "Single panel hasn't been minimized");

    // add second selection
    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
    await secondRunnerButton.element.scrollIntoView({
      block: "center",
    });
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
    await thirdRunnerButton.element.scrollIntoView({
      block: "center",
    });
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
    await browser.waitUntilDisplayed(sbkPlacePanel.element, "Place panel hasn't been expanded");

    await browser.waitUntilEquals(placeMultiples1stSelection.title, "Man City");
  });

  describe("market closed and odds movement notification", () => {
    describe("when odds of 1st selection change", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getMarketPrices(SMP_MOCK_FIRST_MARKET_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_ODDS_MOVEMENT_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(placeAlert.message, "Odds have changed");
      });

      it("[PRPI-7914] should display the odds movement notification", async () => {
        expect(await placeAlert.message.getText()).toBe("Odds have changed");
      });

      describe("when 1st selection market closes", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_FIRST_MARKET_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_MARKET_CLOSED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeAlert.message, "Odds and availability have changed");
        });

        it("[PRPI-7915] should display the contextual signposting on the collapse 1st selection", async () => {
          expect(await placeMultiples1stSelection.hintMessage.getText()).toBe("CLOSED");
          expect(await placeMultiples1stSelection.hintWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7916] should have multiples inputs disabled", async () => {
          expect(await placeMultipleStakeField.element.isEnabled()).toBe(true);
          expect(await placeMultipleOddsField.element.isEnabled()).toBe(true);
        });

        it("[PRPI-7917] should display the contextual signposting on the 1st selection single", async () => {
          expect(await placePanel1stSingleHint.message.getText()).toBe("CLOSED");
          expect(await placePanel1stSingleHint.typeWarning.isDisplayed()).toBe(true);
        });

        it("[PRPI-7918] should have 1st selection single stake input disabled", async () => {
          expect(await placePanel1stSingleStakeField.numberField.isEnabled()).toBe(false);
        });

        it("[PRPI-7919] should display the availability notification", async () => {
          expect(await placeAlert.message.getText()).toBe("Odds and availability have changed");
        });

        it("[PRPI-7920] should display a disabled place button with a 'Please Enter Stake' label", async () => {
          expect(await placeButton.element.isEnabled()).toBe(false);
          expect(await placeButton.element.getText()).toBe("Please Enter Stake");
        });

        describe("when 2nd selection market closes", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_SECOND_MARKET_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
            );
            await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_MARKET_CLOSED_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(placeAlert.message, "Odds and availability have changed");
          });

          it("[PRPI-7921] should display the availability notification", async () => {
            expect(await placeAlert.message.getText()).toBe("Odds and availability have changed");
          });

          describe("when 3rd selection market closes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_THIRD_MARKET_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
              );
              await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_MARKET_CLOSED_MOCK));
              await browser.tickFakeClock();
              await browser.waitUntilEquals(placeButton.label, "Suspended");
            });

            it("[PRPI-7922] should display a disabled place button with a 'Suspended' label", async () => {
              expect(await placeButton.element.isEnabled()).toBe(false);
              expect(await placeButton.label.getText()).toBe("Suspended");
            });
          });
        });
      });
    });
  });
});
