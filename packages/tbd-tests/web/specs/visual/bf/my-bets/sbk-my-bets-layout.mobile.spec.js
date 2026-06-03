const { getMyBetsLayout, getMarkets, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const {
  MyBetsPagePO,
  CardPO,
  SportsbookBetPanelPO,
  SportsbookBetButtonPO,
  BetDetailsPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";
const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const firstSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const secondSbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[1]);
const firstSbkBetCardPO = new CardPO(firstSbkBetPanelPO.element);
const secondSbkBetCardPO = new CardPO(secondSbkBetPanelPO.element);

const reUseSelectionsButtonPO = new SportsbookBetButtonPO();
const betDetailsPO = new BetDetailsPO();

/* SBK BET Mocks */
const SBK_BET_INFO_CARD_PARTIAL = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_LEG_DATA = {
  type: "SS",
  result: "PLACED",
  parts: [
    {
      price: {
        decimal: 1.86,
        fractional: {
          numerator: 43,
          denominator: 50,
        },
      },
      marketBetUrn: "ppb:marketBet:924.237747664",
      eventDescription: "Spezia v Entella",
      eventMarketDescription: "Match Odds",
      selectionName: "Spezia",
      startTime: "2020-07-27T19:00:00.000Z",
      rule4Deductions: 5.5,
    },
  ],
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SBK_BET_LEG_DATA,
};

const SBK_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229536",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: false,
      betType: "SGL",
      currentSize: 0.12,
      result: "CASHED_OUT",
      legs: [SBK_BET_LEG],
      bonus: 1,
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_LEG,
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
  },
};

const SBK_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const BETCARD_GROUP_CARDS_SBK_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_BET],
  headerItems: HEADER_ITEMS_MOCK,
};

/* SBK BET FORECAST THREE RUNNERS Mocks */
const SBK_BET_CARD_FORECAST_THREE_RUNNERS_LEG_DATA = {
  type: "CF",
  result: "null",
  parts: [
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 6.5, fractional: { numerator: 6, denominator: 5 } },
      priceType: "DIVIDEND",
      selectionName: "Doctor Ken",
      startTime: "2021-03-24T17:05:00Z",
    },
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 3.25, fractional: { numerator: 9, denominator: 4 } },
      priceType: "DIVIDEND",
      selectionName: "Unanswered Prayers",
      startTime: "2021-03-24T17:05:00Z",
    },
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 5.5, fractional: { numerator: 9, denominator: 2 } },
      priceType: "DIVIDEND",
      selectionName: "Mixedwave",
      startTime: "2021-03-24T17:05:00Z",
    },
  ],
};

const FORECAST_EVENT_HEADER_CARD_PARTIAL = {
  node: {
    __typename: "EventHeaderCard",
    urn: "ppb:tbd:card:eventHeader:1053675438/0",
  },
};

const FORECAST_EVENT_HEADER_CARD = {
  node: {
    __typename: "EventHeaderCard",
    urn: "ppb:tbd:card:eventHeader:1053675438/0",
    title: "17:05 FLAT 2m 0f 125y",
    subtitle: "Win",
    tertiaryTitle: "Special",
    sportId: "7",
    date: "2021-03-24T17:05:00Z",
  },
};

const SBK_BET_CARD_FORECAST_THREE_RUNNERS_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:1072954805/0",
  ...SBK_BET_CARD_FORECAST_THREE_RUNNERS_LEG_DATA,
};

const SBK_BET_CARD_FORECAST_THREE_RUNNERS_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675438",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.1053675438",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1053675438",
      betReceiptId: "O/11037374/0000372",
      id: "1053675438",
      profitAndLoss: "0",
      betType: "SGL",
      currentSize: 0.78,
      numLines: 6,
      currentSizePerLine: 0.13,
      isOpen: false,
      isSettled: true,
      legs: [SBK_BET_CARD_FORECAST_THREE_RUNNERS_LEG],
      result: "LOST",
      cashoutQuote: null,
    },
  },
};

const SBK_BET_CARD_FORECAST_THREE_RUNNERS_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675438",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
                    betUrn: "ppb:sbkBet:1053675438",
                    leg: SBK_BET_CARD_FORECAST_THREE_RUNNERS_LEG,
                  },
                },
                FORECAST_EVENT_HEADER_CARD,
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
                  },
                },
                FORECAST_EVENT_HEADER_CARD_PARTIAL,
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            urn: "ppb:tbd:card:sbkBetInfo:1179447055",
            betReceiptId: "O/11037374/0000372",
            placedDate: "2020-07-27T15:22:00Z",
            settledDate: "2020-07-27T18:09:00.000Z",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
          },
        },
        { node: { ...SBK_BET_INFO_CARD_PARTIAL, urn: "ppb:tbd:card:sbkBetInfo:1179447055" } },
      ],
    },
  },
};

const SBK_BET_CARD_FORECAST_THREE_RUNNERS_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675438",
  },
};

const SBK_BET_CARD_FORECAST_THREE_RUNNERS_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675438",
  },
};

const BETCARD_GROUP_CARDS_FORECAST_THREE_RUNNERS_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1000000002|sbk",
    full: {
      edges: [SBK_BET_CARD_FORECAST_THREE_RUNNERS_FULL, SBK_BET_CARD_FORECAST_THREE_RUNNERS_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [
        SBK_BET_CARD_FORECAST_THREE_RUNNERS_PARTIALS,
        SBK_BET_CARD_FORECAST_THREE_RUNNERS_CARDS_EXPANDABLE_PARTIAL,
      ],
    },
  },
};

/* SBK BET FORECAST TWO RUNNERS Mocks */
const SBK_BET_CARD_FORECAST_TWO_RUNNERS_LEG_DATA = {
  type: "CF",
  result: "null",
  parts: [
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 2.2, fractional: { numerator: 6, denominator: 5 } },
      priceType: "DIVIDEND",
      selectionName: "Doctor Ken",
      startTime: "2021-03-24T17:05:00Z",
    },
    {
      eventDescription: "17:05 FLAT 2m 0f 125y",
      eventMarketDescription: "Win",
      marketBetUrn: "ppb:marketBet:924.258204896",
      price: { decimal: 5.5, fractional: { numerator: 9, denominator: 2 } },
      priceType: "DIVIDEND",
      selectionName: "Mixedwave",
      startTime: "2021-03-24T17:05:00Z",
    },
  ],
};

const SBK_BET_CARD_FORECAST_TWO_RUNNERS_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:1053675439/0",
  ...SBK_BET_CARD_FORECAST_TWO_RUNNERS_LEG_DATA,
};

const SBK_BET_CARD_FORECAST_TWO_RUNNERS_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675439",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.1053675439",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1053675439",
      betReceiptId: "O/11037374/0000372",
      id: "1053675439",
      profitAndLoss: "0",
      betType: "SGL",
      currentSize: 1.22,
      currentSizePerLine: 0.61,
      numLines: 2,
      isOpen: false,
      legs: [SBK_BET_CARD_FORECAST_TWO_RUNNERS_LEG],
      result: "LOST",
      cashoutQuote: null,
    },
  },
};

const SBK_BET_CARD_FORECAST_TWO_RUNNERS_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675439",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675439/0",
            full: {
              edges: [
                // FORECAST_EVENT_HEADER_CARD,
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675439/0",
                    betUrn: "ppb:sbkBet:1053675439",
                    leg: SBK_BET_CARD_FORECAST_TWO_RUNNERS_LEG,
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                // FORECAST_EVENT_HEADER_CARD_PARTIAL,
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1053675439/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/11037374/0000372",
            placedDate: "2020-07-27T11:22:00Z",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1053675439/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_CARD_FORECAST_TWO_RUNNERS_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1053675439",
  },
};

const SBK_BET_CARD_FORECAST_TWO_RUNNERS_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675439",
  },
};

const BETCARD_GROUP_CARDS_FORECAST_TWO_RUNNERS_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1000000003|sbk",
    full: {
      edges: [SBK_BET_CARD_FORECAST_TWO_RUNNERS_FULL, SBK_BET_CARD_FORECAST_TWO_RUNNERS_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [
        SBK_BET_CARD_FORECAST_TWO_RUNNERS_PARTIALS,
        SBK_BET_CARD_FORECAST_TWO_RUNNERS_CARDS_EXPANDABLE_PARTIAL,
      ],
    },
  },
};

const BFF_MY_BETS_FORECAST_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_FORECAST_TWO_RUNNERS_BET, BETCARD_GROUP_CARDS_FORECAST_THREE_RUNNERS_BET],
  headerItems: HEADER_ITEMS_MOCK,
};

/* SBK BET EACH WAY Mocks */
const SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
    numberOfRunners: 14,
    showMeetingInfo: true,
    race: {
      __typename: "Race",
      urn: "ppb:race:29901908.1410",
      startTime: "2020-07-13T14:40:00Z",
      name: "Aintree",
      details: {
        distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
        going: "GOOD_FIRM",
        status: "GOING_DOWN",
        type: "FLAT",
      },
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:29901908",
        name: "Wind 13th Jul",
        country: "GB",
        countryFlag: {
          medium: "http://example.test.com/mockedImage/image.png",
        },
        venue: "Aintree",
      },
    },
    raceViewLink: {
      viewUrn: "ppb:tbd:view:race:7|30819268.1605",
      viewUrl: "horse-racing/chepstow-25th-mar/2m-nov-hrd/r-924.258298128",
    },
  },
};

const SBK_BET_EACH_WAY_LEG_DATA = {
  type: "SS",
  result: null,
  parts: [
    {
      price: {
        decimal: 1.4,
        fractional: {
          numerator: 2,
          denominator: 5,
        },
      },
      priceType: "GUARANTEED",
      eventDescription: "13:00 NOVICES HURDLE 2m 0f 11y",
      eventMarketDescription: "Each Way",
      selectionName: "Galice Macalo",
      startTime: "2021-03-25T13:00:00Z",
      eachwayPlaces: 3,
      eachwayFactor: {
        numerator: 1,
        denominator: 5,
      },
    },
  ],
};

const SBK_BET_EACH_WAY_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:1072954805/0",
  ...SBK_BET_EACH_WAY_LEG_DATA,
};

const SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS_PARTIALS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:30819268.1605|true",
  },
};

const SBK_BET_CARD_EACH_WAY_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1072954805",
  },
};

const SBK_BET_CARD_EACH_WAY_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1072954805",
    navigationLinks: [
      {
        viewUrl: "horse-racing/chepstow-25th-mar/r-7%7C30376076.1300",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1072954805",
      betReceiptId: "O/11037374/0000500",
      id: "1072954805",
      isSettled: false,
      profitAndLoss: 0.27,
      betType: "SGL",
      currentSize: 0.22,
      numLines: 2,
      currentSizePerLine: 0.11,
      betPrice: {
        decimal: 2.29,
        fractional: {
          numerator: 129,
          denominator: 100,
        },
      },
      legs: [SBK_BET_EACH_WAY_LEG],
      result: null,
      cashoutQuote: null,
    },
  },
};
const SBK_BET_EACH_WAY_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1072954805",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
                    betUrn: "ppb:sbkBet:1072954805",
                    leg: SBK_BET_EACH_WAY_LEG,
                  },
                },
                SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS,
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
                  },
                },
                SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS_PARTIALS,
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            placedDate: "2020-07-27T15:22:00Z",
            betReceiptId: "O/11037374/0000500",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_EACH_WAY_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:1072954805",
  },
};

const BETCARD_GROUP_CARDS_EACH_WAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1072954805|sbk",
    full: {
      edges: [SBK_BET_CARD_EACH_WAY_FULL, SBK_BET_EACH_WAY_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_EACH_WAY_PARTIALS, SBK_BET_EACH_WAY_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_EACH_WAY_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_EACH_WAY],
  settlementLink: "https://support.betfair.com/app/answers/detail/bet-settlement-queries/",
  headerItems: HEADER_ITEMS_MOCK,
};

/* EACH WAY SETTLED Mock */
const BFF_MY_BETS_EACH_WAY_MOCK_SETTLED = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:settled",
  url: routes.getMyBetsViewUrl("settled"),
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_CARDS_EACH_WAY],
  settlementLink: "https://support.betfair.com/app/answers/detail/bet-settlement-queries/",
  headerItems: HEADER_ITEMS_MOCK,
};

/* NO BETS Mock */
const BFF_MY_BETS_MOCK_WITHOUT_CARDS = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [],
  headerItems: HEADER_ITEMS_MOCK,
};

/* SBK BET WITH PREPLAY SCOREBOARD Mocks */
const SBK_BET_CARD_SCOREBOARD_PRE_PLAY_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
    sportevent: { urn: "ppb:event:2022802", name: "Spezia v Entella" },
    scheduledAt: "2020-07-27T19:00:00Z",
    fixtureEventViewLink: {
      viewUrn: "ppb:tbd:view:event:2022802",
      viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
    },
    fixture: {
      urn: "ppb:fixture:2022802",
      home: { name: "Spezia" },
      away: { name: "Entella" },
    },
  },
};

const SBK_BET_CARD_SCOREBOARD_PRE_PLAY_PARTIALS_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
  },
};

const SBK_BET_CARD_SCOREBOARD_PREPLAY_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_LEG,
                  },
                },
                { ...SBK_BET_CARD_SCOREBOARD_PRE_PLAY_FIXTURE },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                SBK_BET_CARD_SCOREBOARD_PRE_PLAY_PARTIALS_FIXTURE,
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/4275336/0021305",
            placedDate: "2020-07-27T15:22:00Z",
            selections: [{ marketUrn: "ppb:sbkMarket:924.237747664", runnerUrn: "ppb:sbkRunner:924.237747664/48044" }],
            product: "SPORTSBOOK",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_SCOREBOARD_PRE_PLAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_SCOREBOARD_PREPLAY_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK_SCOREBOARD_PRE_PLAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_BET_SCOREBOARD_PRE_PLAY],
  headerItems: HEADER_ITEMS_MOCK,
};

/* SBK BET WITH INPLAY SCOREBOARD Mocks */
const SBK_BET_CARD_SCOREBOARD_IN_PLAY_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
    sportevent: { urn: "ppb:event:2022802", name: "Spezia v Entella" },
    scheduledAt: "2020-07-27T19:00:00Z",
    fixtureEventViewLink: {
      viewUrn: "ppb:tbd:view:event:2022802",
      viewUrl: "football/argentinian-reserves/ca-lanus-(res)-v-ca-union-santa-fe-(res)/e-30744688",
    },
    fixture: {
      urn: "ppb:fixture:2022802",
      home: { name: "Spezia" },
      away: { name: "Entella" },
      score: {
        home: 1,
        away: 1,
      },
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  },
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:31111111|viewLink|0",
    sportevent: {
      urn: "ppb:event:31111111",
      name: "Reeves/OtherGuyFromTheMatrix v Keeves/GuyFromFriends",
    },
    fixture: {
      __typename: "TennisMatch",
      urn: `ppb:fixture:31111111`,
      runnerNames: {
        home: "Reeves/OtherGuyFromTheMatrix",
        away: "Keeves/GuyFromFriends",
      },
      scheduledStartTime: "2032-01-16T20:00:00Z",
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamA: {
        side: "HOME",
        players: [
          { name: "Keanu Reeves", rank: 420 },
          { name: "The OtherGuyFromTheMatrix", rank: 69 },
        ],
      },
      teamB: {
        side: "AWAY",
        players: [
          { name: "Reanu Keeves", rank: 69 },
          { name: "That GuyFromFriends", rank: 69 },
        ],
      },
    },
  },
};

const SCA_MOCK = {
  match: [
    {
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "1",
      teamBScore: "1",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

const SBK_BET_CARD_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802|viewLink|0",
  },
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:31111111|viewLink|0",
  },
};

const SBK_BET_CARD_SCOREBOARD_INPLAY_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_LEG,
                  },
                },
                { ...SBK_BET_CARD_SCOREBOARD_IN_PLAY_FIXTURE },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                SBK_BET_CARD_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE,
              ],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            betReceiptId: "O/4275336/0021305",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const SBK_BET_CARD_TENNIS_SCOREBOARD_INPLAY_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:926229536",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                    betUrn: "ppb:sbkBet:926229536",
                    leg: SBK_BET_LEG,
                  },
                },
                { ...SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_FIXTURE },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
                  },
                },
                SBK_BET_CARD_TENNIS_SCOREBOARD_IN_PLAY_PARTIALS_FIXTURE,
              ],
            },
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:926229536/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_SCOREBOARD_IN_PLAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_SCOREBOARD_INPLAY_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_TENNIS_SCOREBOARD_IN_PLAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, SBK_BET_CARD_TENNIS_SCOREBOARD_INPLAY_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK_SCOREBOARD_IN_PLAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_BET_SCOREBOARD_IN_PLAY],
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MY_BETS_MOCK_TENNIS_SCOREBOARD_IN_PLAY = {
  ...BFF_MY_BETS_MOCK_SCOREBOARD_IN_PLAY,
  edges: [BETCARD_GROUP_CARDS_SBK_BET_TENNIS_SCOREBOARD_IN_PLAY],
};

/* SBK SPECIAL BET WITH EVENT HEADER  Mocks */
const SPECIAL_EVENT_HEADER_CARD_PARTIAL = {
  node: {
    __typename: "EventHeaderCard",
    urn: "ppb:tbd:card:eventHeader:1526415421/0",
  },
};

const SPECIAL_EVENT_HEADER = {
  node: {
    ...SPECIAL_EVENT_HEADER_CARD_PARTIAL.node,
    title: "United State of America General Presidential Election 2024",
    tertiaryTitle: "United States of America Politics, General Elections and Worldwide Global Impact",
    sportId: "2378961",
    date: "2024-11-05T12:00:00.000Z",
  },
};

const SPECIAL_BET_LEG_CARD_PARTIAL = {
  node: {
    __typename: "BetLegCard",
    urn: "ppb:tbd:card:sbkBetLeg:1526415421/0",
  },
};

const SPECIAL_BET_LEG_DATA = {
  type: "SS",
  parts: [
    {
      marketBetUrn: "ppb:marketBet:924.244240236",
      price: {
        decimal: 3.25,
        fractional: {
          numerator: 2,
          denominator: 1,
        },
      },
      originalPrice: {
        decimal: 2.1,
        fractional: {
          numerator: 11,
          denominator: 10,
        },
      },
      priceType: "LIVE",
      eventDescription: "United States Of America Presidential Election 2024",
      eventMarketDescription: "US Presidential General Election that will occur at 2024",
      selectionName: "Joseph Robinette Biden, Junior aka Joe Biden or the man who defeated Trump",
    },
  ],
};

const SPECIAL_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:926229536/0",
  ...SPECIAL_BET_LEG_DATA,
};

const SBK_SPECIAL_BET_CARD_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1526415421",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:cardgroup:sbkBetLeg:1526415421/0",
            full: {
              edges: [
                {
                  node: {
                    ...SPECIAL_BET_LEG_CARD_PARTIAL.node,
                    betUrn: "ppb:sbkBet:1526415421",
                    leg: SPECIAL_BET_LEG,
                  },
                },
                SPECIAL_EVENT_HEADER,
              ],
            },
            partials: {
              partialEdges: [SPECIAL_BET_LEG_CARD_PARTIAL, SPECIAL_EVENT_HEADER_CARD_PARTIAL],
            },
          },
        },
        {
          node: {
            ...SBK_BET_INFO_CARD_PARTIAL,
            placedDate: "2023-03-09T18:26:50.000Z",
            settledDate: null,
            betReceiptId: "O/11037374/0002490",
            regulatorBetId: "O/11037374/0002491",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:cardgroup:sbkBetLeg:1526415421/0",
          },
        },
        { node: SBK_BET_INFO_CARD_PARTIAL },
      ],
    },
  },
};
const SBK_SPECIAL_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1526415421",
  },
};

const SBK_SPECIAL_BET_CARD_FULL = {
  node: {
    ...SBK_SPECIAL_BET_CARD_PARTIALS.node,
    navigationLinks: [],
    bet: {
      urn: "ppb:sbkBet:1526415421",
      __typename: "SportsbookBet",
      betReceiptId: "O/11037374/0002490",
      id: "1526415421",
      isSettled: false,
      originalPotentialWin: 0.21,
      profitAndLoss: 0.33,
      isOddsBoosted: true,
      betType: "SGL",
      currentSize: 0.11,
      numLines: 1,
      legs: [SPECIAL_BET_LEG],
    },
  },
};

const SBK_SPECIAL_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1526415421",
  },
};

const BETCARD_GROUP_CARDS_SBK_SPECIAL_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1526415421|sbk",
    full: {
      edges: [SBK_SPECIAL_BET_CARD_FULL, SBK_SPECIAL_BET_CARD_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_SPECIAL_BET_CARD_PARTIALS, SBK_SPECIAL_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK_SPECIAL = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [BETCARD_GROUP_CARDS_SBK_SPECIAL_BET],
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MARKETS_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: "ppb:sbkMarket:924.237747664",
      runners: [
        {
          runnerURN: "ppb:sbkRunner:924.237747664/48044",
          selectionId: 48044,
          name: "Spezia",
        },
        {
          runnerURN: "ppb:sbkRunner:924.237747664/58805",
          selectionId: 58805,
        },
        {
          runnerURN: "ppb:sbkRunner:924.237747664/48351",
          selectionId: 48351,
        },
      ],

      hierarchy: {
        __typename: "EventCompetitionHierarchy",
        sportevent: {
          name: "Spezia v Entella",
        },
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.237747664",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          noOdds: true,
        },
      ],
    },
  ],
};

const BET_COMBINATIONS_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.237747664",
          selectionId: 48044,
        },
      ],
    },
  ],
};

const RUNNER_ODDS_MOCK = {
  runner: {
    marketId: "924.237747664",
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

describe("My Bets Page - SBK Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  });

  describe("when the user opens the my bets page", () => {
    describe("and has no open bets available", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK.urn, { products: ["sportsbook"] }));
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_WITHOUT_CARDS));
        await browser.url(routes.getMyBetsViewUrl("open"));
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1443]_should_see_my_bets_page_with_only_the_header_container`,
        );
      });

      it("[PRPI-1443]_should_see_my_bets_page_with_only_the_header_container", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1443]_should_see_my_bets_page_with_only_the_header_container`,
          ),
        ).toBe(0);
      });
    });

    describe("and has one single Sportsbook bet", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MY_BETS_MOCK.urn, { products: ["sportsbook"] }));
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
        await browser.url(routes.getMyBetsViewUrl("open"));
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1444]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_collapsed`,
        );
      });

      describe("and accordion is collapsed", () => {
        it("[PRPI-1444]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_collapsed", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1444]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_collapsed`,
            ),
          ).toBe(0);
        });
      });

      describe("and accordion is expanded", () => {
        beforeAll(async () => {
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await firstSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1445]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_expanded`,
          );
        });

        it("[PRPI-1445]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_expanded", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1445]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_bet_card_expanded`,
            ),
          ).toBe(0);
        });
      });
    });

    describe("and has one each way Sportsbook bet", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_EACH_WAY_MOCK.urn, { products: ["sportsbook"] }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_EACH_WAY_MOCK));
        await mockService.mockHttpRequest(getScaResponse({}));
        await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
        await browser.url(routes.getMyBetsViewUrl("open"));

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1446]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_collapsed`,
        );
      });

      describe("and accordion is collapsed", () => {
        it("[PRPI-1446]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_collapsed", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1446]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_collapsed`,
            ),
          ).toBe(0);
        });
      });

      describe("and accordion is expanded", () => {
        beforeAll(async () => {
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await firstSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1447]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_expanded`,
          );
        });

        it("[PRPI-1447]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_expanded", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1447]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_each_way_bet_card_expanded`,
            ),
          ).toBe(0);
        });
      });
    });

    describe("and has forecast Sportsbook open bets", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_FORECAST_MOCK.urn, { products: ["sportsbook"] }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_FORECAST_MOCK));
        await browser.url(routes.getMyBetsViewUrl("open"));
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1448]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_collapsed`,
        );
      });

      describe("and accordion are collapsed", () => {
        it("[PRPI-1448]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_collapsed", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1448]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_collapsed`,
            ),
          ).toBe(0);
        });
      });

      describe("and accordion are expanded", () => {
        beforeAll(async () => {
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await firstSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
          await secondSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(secondSbkBetCardPO.content);
          await firstSbkBetPanelPO.panelTitle.scrollIntoView({ block: "start" });
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1449]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_expanded`,
          );
        });

        it("[PRPI-1449]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_expanded", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1449]_should_see_my_bets_page_with_two_forecast_bet_cards_with_three_and_two_runners_respectively_expanded`,
            ),
          ).toBeLessThanOrEqual(0.001);
        });
      });
    });

    describe("and has one single Sportsbook bet with scoreboard (pre-play)", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_MOCK_SCOREBOARD_PRE_PLAY.urn, { products: ["sportsbook"] }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SCOREBOARD_PRE_PLAY));
        await browser.url(routes.getMyBetsViewUrl("open"));
        await browser.waitUntilInViewport(firstSbkBetCardPO.header);
        await firstSbkBetCardPO.header.click();
        await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
        await browser.waitUntilDisplayed(reUseSelectionsButtonPO.element);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1450]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_pre_play_scoreboard_and_reuse_selections_button`,
        );
      });

      it("[PRPI-1450]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_pre_play_scoreboard_and_reuse_selections_button", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1450]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_pre_play_scoreboard_and_reuse_selections_button`,
          ),
        ).toBe(0);
      });

      describe("and when the user taps 'Re-use selections' CTA button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(BFF_MARKETS_MOCK));
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
          await mockService.mockHttpRequest(
            getImplyBetsResponse({ betCombinations: [BET_COMBINATIONS_MOCK], runnerOdds: [RUNNER_ODDS_MOCK] }),
          );
          await reUseSelectionsButtonPO.element.waitForClickable();
          await reUseSelectionsButtonPO.element.click();
          await browser.waitUntilDisplayed(betDetailsPO.element);

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1451]_should_see_my_bets_page_with_betslip_expanded`,
          );
        });

        afterAll(async () => {
          await betDetailsPO.remove.waitForClickable();
          await betDetailsPO.remove.click();
        });

        it("[PRPI-1451]_should_see_my_bets_page_with_betslip_expanded", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1451]_should_see_my_bets_page_with_betslip_expanded`),
          ).toBe(0);
        });
      });
    });

    describe("and has one single Sportsbook bet with scoreboard (in-play)", () => {
      describe("and is football", () => {
        beforeAll(async () => {
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_MY_BETS_MOCK_SCOREBOARD_IN_PLAY.urn, { products: ["sportsbook"] }),
          );
          await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SCOREBOARD_IN_PLAY));
          await browser.url(routes.getMyBetsViewUrl("open"));
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await firstSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1452]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_scoreboard`,
          );
        });

        it("[PRPI-1452]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_scoreboard", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1452]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_scoreboard`,
            ),
          ).toBe(0);
        });
      });

      xdescribe("and is tennis", () => {
        beforeAll(async () => {
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_MY_BETS_MOCK_TENNIS_SCOREBOARD_IN_PLAY.urn, { products: ["sportsbook"] }),
          );
          await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_TENNIS_SCOREBOARD_IN_PLAY));
          await mockService.mockHttpRequest(getScaResponse(SCA_MOCK));
          await browser.url(routes.getMyBetsViewUrl("open"));
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await firstSbkBetCardPO.header.click();
          await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1453]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_tennis_scoreboard`,
          );
        });

        it("[PRPI-1453]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_tennis_scoreboard", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1453]_should_see_my_bets_page_with_one_sbk_single_bet_card_with_in_play_tennis_scoreboard`,
            ),
          ).toBe(0);
        });
      });
    });

    describe("and has one single Sportsbook special bet with odds boost", () => {
      beforeAll(async () => {
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_MOCK_SPECIAL.urn, { products: ["sportsbook"] }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_SPECIAL));
        await browser.url(routes.getMyBetsViewUrl("open"));
        await browser.waitUntilInViewport(firstSbkBetCardPO.header);
        await firstSbkBetCardPO.header.click();
        await browser.waitUntilDisplayed(firstSbkBetCardPO.content);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1454]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_special_bet_card`,
        );
      });

      it("[PRPI-1454]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_special_bet_card", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1454]_should_see_my_bets_page_with_the_header_container_and_with_one_sbk_single_special_bet_card`,
          ),
        ).toBe(0);
      });
    });

    describe("and the user clicks on settled bets and has one settled bet", () => {
      describe("should be displayed the settled bet and the settlement help link", () => {
        beforeAll(async () => {
          await mockService.mockFonts(getMockFonts());
          await mockService.mockHttpRequest(
            await getIndexHTML(BFF_MY_BETS_EACH_WAY_MOCK_SETTLED.urn, { products: ["sportsbook"] }),
          );
          await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_EACH_WAY_MOCK_SETTLED));
          await browser.url(routes.getMyBetsViewUrl("settled"));
          await browser.waitUntilInViewport(firstSbkBetCardPO.header);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1455]_should_display_help_icon_when_in_settled_state`,
          );
        });
        it("[PRPI-1455]_should_display_help_icon_when_in_settled_state", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1455]_should_display_help_icon_when_in_settled_state`),
          ).toBe(0);
        });
      });
    });
  });
});
