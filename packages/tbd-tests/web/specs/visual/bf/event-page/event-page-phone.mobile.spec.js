const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { PebbleListPO, MarketPromoPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");

const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const pebblesPO = new PebbleListPO();
const secondPebble = pebblesPO.pebbles[1];
const thirdPebble = pebblesPO.pebbles[2];

const EVENT_ID = "29359895";
const SPORTSBOOK_MARKET_ID = "924.222615412";
const MARKET_URN = "ppb:sbkMarket:924.1";

const createCorrectScoreRunners = (isDetails = false) => {
  const result = [];

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const selectionId = `${i + 1}${j}`;

      result.push(
        isDetails
          ? {
              selectionId,
              runnerOdds: {
                decimalDisplayOdds: { decimalOdds: parseFloat(`1.${selectionId}`) },
                fractionalDisplayOdds: { numerator: 1, denominator: 2 },
              },
            }
          : {
              runnerURN: `ppb:sbkRunner:924.1/${selectionId}`,
              selectionId,
              name: `${i} - ${j}`,
              marketURN: MARKET_URN,
            },
      );
    }
  }

  return result;
};

const createCorrectScoreRunnersSMP = () => {
  const result = [];

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const selectionId = `${i + 1}${j}`;

      result.push({
        selectionId,
        runnerStatus: "SUSPENDED",
        noOdds: true,
      });
    }
  }

  return result;
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        pebbleCardGroupTitle: { translated: "Places" },
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
        selectedItemUrn: "ppb:tbd:card:market:924.229299861",
        full: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299861",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
                numberOfItemsToDisplay: 3,
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  marketType: "CORRECT_SCORE",
                  marketTypeName: null,
                  name: "1.5",
                  runners: createCorrectScoreRunners(),
                },
                runners: createCorrectScoreRunners().map((runner) => ({ runnerURN: runner.urn })),
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299909",
                template: "INLINE",
                marketId: "ppb:sbkMarket:924.229299909",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      marketType: "MATCH_ODDS_90",
                      marketTypeName: null,
                      name: "2.5",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.229299909",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.4444444444444",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "5.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.5555555555555",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.666666666666",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299861",
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299909",
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.4444444444444",
              },
            },
            {
              name: "5.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.5555555555555",
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.666666666666",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:allMarkets:1",
        quickLinksTitle: "All Markets",
        links: [
          {
            label: "View All Markets",
            target: "_self",
            icon: null,
            viewLink: {
              viewUrl: routes.getEventViewUrl(EVENT_ID),
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
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

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "55190",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48224",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.1",
      marketStatus: "SUSPENDED",
      runnerDetails: [createCorrectScoreRunnersSMP()],
    },
  ],
};

const MODULE_NAME = "event_page";

const BFF_MOCK_WITH_BLURBS = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    urn: `ppb:event:${EVENT_ID}`,
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        pebbleCardGroupTitle: { translated: "Places" },
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
        selectedItemUrn: "ppb:tbd:card:market:924.229299861",
        full: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299861",
                marketPromo: {
                  title: "Half priced double bet",
                  description:
                    "Double bet at half price to enhance your wagering precision. After 00 am Tomorrow, standard betting will be restated.",
                  signposting: "EXTRA_PLACES",
                },
                blurbs: [
                  {
                    __typename: "InformativeBlurb",
                    title: {
                      __typename: "DisplayNameTitle",
                      name: "Calculate potential payouts for double bets.",
                    },
                    description: {
                      __typename: "DisplayNameTitle",
                      name: "Betfair double bet calculator makes it easy to calculate potential payouts for double bets",
                    },
                    isCollapsed: false,
                    supplementaryInfo: {
                      __typename: "SupplementaryInfo",
                      label: {
                        __typename: "DisplayNameTitle",
                        name: "Betfair double bet calculator",
                      },
                      viewLink: {
                        viewUrl: "https://betting.betfair.com/bet-calculator/double/",
                        viewDisplayMode: "BLANK_INAPP",
                        __typename: "ViewLink",
                      },
                    },
                  },
                ],

                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
                numberOfItemsToDisplay: 3,
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  marketType: "CORRECT_SCORE",
                  marketTypeName: null,
                  name: "1.5",
                  runners: createCorrectScoreRunners(),
                },
                runners: createCorrectScoreRunners().map((runner) => ({ runnerURN: runner.urn })),
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299909",
                template: "INLINE",
                marketId: "ppb:sbkMarket:924.229299909",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      marketType: "MATCH_ODDS_90",
                      marketTypeName: null,
                      name: "2.5",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.229299909",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.4444444444444",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "5.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.5555555555555",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.666666666666",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      eventId: EVENT_ID,
                      urn: "ppb:sbkMarket:924.222615412",
                      name: "Match Odds",
                      liveData: {
                        inplay: false,
                      },
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/48224",
                          name: "Tottenham",
                          selectionId: 48224,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.222615412/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.222615412/55190" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/48224" },
                      { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "0.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299861",
              },
            },
            {
              name: "1.5",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
              },
            },
            {
              name: "2.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.229299909",
              },
            },
            {
              name: "4.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.4444444444444",
              },
            },
            {
              name: "5.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.5555555555555",
              },
            },
            {
              name: "6.5",
              node: {
                __typename: "MarketCard",
                urn: "ppb:tbd:card:market:924.666666666666",
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
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleMarkets:924.229299861",
      },
    },
  ],
};

describe("Football Event Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4688]_should_render_basic_market_template`);
  });

  it("[PRPI-4688]_should_render_basic_market_template", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4688]_should_render_basic_market_template`)).toBe(0);
  });

  describe("When the user clicks on a pebble with a different template", () => {
    beforeAll(async () => {
      await secondPebble.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4689]_should_render_correct_score`);
    });

    it("[PRPI-4689]_should_render_correct_score", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4689]_should_render_correct_score`)).toBe(0);
    });
  });

  describe("When the user clicks on a pebble with a different template", () => {
    beforeAll(async () => {
      await thirdPebble.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4690]_should_render_inline_template`);
    });

    it("[PRPI-4690]_should_render_inline_template", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4690]_should_render_inline_template`)).toBe(0);
    });
  });

  describe("When a Market Template/Pebble/Default has an 'info blurb' and a 'market promo blurb'", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_WITH_BLURBS.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_WITH_BLURBS));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      const secondMarketPromo = new MarketPromoPO(1);
      await secondMarketPromo.element.click();
      // The market promo component has a hover effect so we need to click outside to avoid
      // that effect to be seen in the screenshot
      await browser
        .action("pointer", { parameters: { pointerType: "mouse" } })
        .move({ origin: "viewport", x: 0, y: 0 })
        .perform();
      await secondMarketPromo.description.waitForDisplayed();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-4691]_default_market_template_should_render_blurbs_with_all_properties_correctly`,
      );
    });

    it("[PRPI-4691]_default_market_template_should_render_blurbs_with_all_properties_correctly", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-4691]_default_market_template_should_render_blurbs_with_all_properties_correctly`,
        ),
      ).toBe(0);
    });
  });
});
