const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");
const {
  getAppContext,
  getMyBetsLayout,
  getMarkets,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const {
  MyBetsScreenSO,
  BottomBarSO,
  CardSO,
  BetSelectionDetailsSO,
  SportsbookBetButtonSO,
  BetDetailsSO,
  BetslipDrawerSO,
} = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
const myBetsScreenSO = new MyBetsScreenSO();
const cardSO = new CardSO();

const sportsBookBetRaceDetailsSO = new RaceDetailsSO(myBetsScreenSO.betCardGroups[0]);
const betSelectionDetailsSO = new BetSelectionDetailsSO();
const reUseSelectionsButtonSO = new SportsbookBetButtonSO();
const betDetailsSO = new BetDetailsSO();
const betslipDrawerSO = new BetslipDrawerSO();

const SBK_BET_LEG_DATA = {
  type: "SS",
  result: "LOST",
  parts: [
    {
      price: { decimal: 1001, fractional: {} },
      marketBetUrn: "ppb:marketBet:924.1",
      eventDescription: "Alberto v Silva",
      eventMarketDescription: "Match Odds 90",
      marketType: "MATCH_ODDS_90",
      selectionName: "Alberto",
      startTime: "2029-07-27T19:00:00.000Z",
    },
  ],
};

const SBK_BET_LEG = {
  __typename: "BetLeg",
  urn: "ppb:sbkBetLeg:90/0",
  ...SBK_BET_LEG_DATA,
};

const SBK_BET = {
  urn: "ppb:sbkBet:90",
  betReceiptId: "O/90/90",
  profitAndLoss: 0.22,
  isOpen: false,
  isSettled: true,
  betType: "SGL",
  currentSize: 0.12,
  result: "LOST",
  legs: [SBK_BET_LEG_DATA],
};

const SBK_BET_CARD_90 = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.90",
      },
    ],

    bet: SBK_BET,
  },
};

const BET_INFO_ID = {
  __typename: "SportsbookBetInfoCard",
  urn: "ppb:tbd:card:sbkBetInfo:1179447017",
};

const SBK_BET_CARDS_EXPANDABLE = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
    full: {
      edges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
            full: {
              edges: [
                {
                  node: {
                    __typename: "BetLegCard",
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                    betUrn: "ppb:sbkBet:90",
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
                    urn: "ppb:tbd:card:sbkBetLeg:90/0",
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            ...BET_INFO_ID,
            betReceiptId: "O/90/90",
          },
        },
      ],
    },
    partials: {
      partialEdges: [
        {
          node: {
            __typename: "SportsbookBetLegCardGroup",
            urn: "ppb:tbd:card:sbkBetLeg:90/0",
          },
        },
        { node: BET_INFO_ID },
      ],
    },
  },
};

const SBK_BET_CARDS_EXPANDABLE_PARTIAL = {
  node: {
    __typename: "SportsbookExpandableLegCardGroup",
    urn: "ppb:tbd:card:group:sbkExpandableLeg:90",
  },
};

const SBK_BET_CARD_PARTIALS_90 = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:90",
  },
};

const BETCARD_GROUP_CARDS_SBK_BET_90 = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:90|sbk",
    full: {
      edges: [SBK_BET_CARD_90, SBK_BET_CARDS_EXPANDABLE],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS_90, SBK_BET_CARDS_EXPANDABLE_PARTIAL],
    },
  },
};

const BFF_MY_BETS_MOCK_NINETY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_CARDS_SBK_BET_90],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

/* SBK 2 SINGLE BETS Mocks */
const BET_LEG = [
  {
    type: "SS",
    result: "PLACED",
    parts: [
      {
        price: {
          decimal: 1.86,
        },
        marketBetUrn: "ppb:marketBet:924.237747664",
        eventDescription: "Spezia v Entella",
        eventMarketDescription: "Match Odds",
        selectionName: "Spezia",
        startTime: "2020-07-27T19:00:00.000Z",
        rule4Deductions: 5.5,
      },
    ],
  },
];

/* 1ST BET */
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
      legs: BET_LEG,
      bonus: 1,
    },
  },
};

const SBK_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229536",
  },
};

const FIRST_LEG_CARD_GROUP_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:926228962/0",
};

const BET_EXPANDABLE_LEGS_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:926228962",
};

const BET_EXPANDABLE_LEGS = {
  ...BET_EXPANDABLE_LEGS_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_PARTIAL,
          full: {
            edges: [],
          },
          partials: {
            partialEdges: [],
          },
        },
      },
      {
        node: {
          ...BET_INFO_ID,
          betReceiptId: "O/4275336/0021305",
          placedDate: "2020-07-27T15:22:00Z",
          selections: [{ marketUrn: "ppb:sbkMarket:924.237747664", runnerUrn: "ppb:sbkRunner:924.237747664/48044" }],
          product: "SPORTSBOOK",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_PARTIAL }, { node: BET_INFO_ID }],
  },
};

const BETCARD_GROUP_CARDS_SBK_BET = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229536|sbk",
    full: {
      edges: [SBK_BET_CARD_FULL, { node: BET_EXPANDABLE_LEGS }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_PARTIALS, { node: BET_EXPANDABLE_LEGS_PARTIAL }],
    },
  },
};

/* 2ND BET */
const SBK_SECOND_BET_CARD_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229537",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.237747664",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:926229537",
      betReceiptId: "O/4275336/0021305",
      profitAndLoss: 0.22,
      isSettled: false,
      betType: "SGL",
      currentSize: 0.12,
      result: null,
      legs: BET_LEG,
    },
  },
};

const SBK_SECOND_BET_CARD_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:926229537",
  },
};

const BETCARD_GROUP_CARDS_SBK_BET2 = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:926229537|sbk",
    full: {
      edges: [SBK_SECOND_BET_CARD_FULL, { node: BET_EXPANDABLE_LEGS }],
    },
    partials: {
      partialEdges: [SBK_SECOND_BET_CARD_PARTIALS, { node: BET_EXPANDABLE_LEGS_PARTIAL }],
    },
  },
};

/* EACH WAT BET Mocks */
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
      name: "1m7f Hcap Hrd",
      details: {
        distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
        going: "GOOD_SOFT",
        status: "DORMANT",
        type: "HURDLE",
      },
      runners: [],
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:29901908",
        name: "Ohi 5th Dec",
        country: "GB",
        venue: "Ohi",
      },
    },
    raceViewLink: {
      viewUrn: "ppb:tbd:view:race:7|30819268.1605",
      viewUrl: "horse-racing/chepstow-25th-mar/2m-nov-hrd/r-924.258298128",
    },
  },
};

const SBK_BET_CARD_EACH_WAY_FULL = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1072954805",
    navigationLinks: [
      {
        marketBetUrn: "ppb:marketBet:924.258298128",
        viewUrl: "horse-racing/chepstow-25th-mar/r-7%7C30376076.1300",
      },
    ],

    bet: {
      urn: "ppb:sbkBet:1072954805",
      betReceiptId: "O/11037374/0000500",
      id: "1072954805",
      isSettled: false,
      profitAndLoss: 0.27,
      originalPotentialWin: 0.19,
      betType: "SGL",
      currentSize: 0.22,
      numLines: 2,
      isOddsBoosted: true,
      betPrice: {
        decimal: 2.29,
        fractional: {
          numerator: 129,
          denominator: 100,
        },
      },
      legs: [
        {
          type: "SS",
          result: null,
          parts: [
            {
              marketBetUrn: "ppb:marketBet:924.258298128",
              originalPrice: {
                decimal: 1.7,
                fractional: {
                  numerator: 3,
                  denominator: 4,
                },
              },
              price: {
                decimal: 2.75,
                fractional: {
                  numerator: 3,
                  denominator: 4,
                },
              },
              priceType: "GUARANTEED",
              eventDescription: "13:00 NOVICES HURDLE 2m 0f 11y",
              eventMarketDescription: "Each Way",
              selectionName: "Galice Macalo ",
              startTime: "2021-03-25T13:00:00Z",
              eachwayPlaces: 3,
              eachwayFactor: {
                numerator: 1,
                denominator: 5,
              },
            },
          ],
        },
      ],
    },
  },
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

const BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:1072954805/0",
};

const BET_LEG_CARD_FIRST_EACH_WAY = {
  ...BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL,
  betUrn: "ppb:sbkBet:1072954805",
  leg: SBK_BET_CARD_EACH_WAY_FULL.node.bet.legs[0],
};

const FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:1072954805/0",
};

const BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1072954805",
};

const BET_EXPANDABLE_LEGS_EACH_WAY = {
  ...BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL,
          full: {
            edges: [{ node: BET_LEG_CARD_FIRST_EACH_WAY }, SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS],
          },
          partials: {
            partialEdges: [
              { node: BET_LEG_CARD_FIRST_EACH_WAY_PARTIAL },
              SBK_BET_CARD_EACH_WAY_RACE_CARD_DETAILS_PARTIALS,
            ],
          },
        },
      },
      {
        node: {
          ...BET_INFO_ID,
          betReceiptId: "O/11037374/0000500",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_EACH_WAY_PARTIAL }, { node: BET_INFO_ID }],
  },
};

const BETCARD_GROUP_CARDS_EACH_WAY = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1072954805|sbk",
    full: {
      edges: [SBK_BET_CARD_EACH_WAY_FULL, { node: BET_EXPANDABLE_LEGS_EACH_WAY }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_EACH_WAY_PARTIALS, { node: BET_EXPANDABLE_LEGS_EACH_WAY_PARTIAL }],
    },
  },
};

/* FORECAST BET Mocks */
const SBK_BET_CARD_FORECAST_RACE_CARD_DETAILS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|true",
    numberOfRunners: 9,
    showMeetingInfo: true,
    race: {
      __typename: "Race",
      urn: "ppb:race:29901908.1410",
      startTime: "2020-11-13T14:40:00Z",
      name: "Aintree",
      details: {
        distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
        going: "GOOD_FIRM",
        status: "GOING_DOWN",
        type: "FLAT",
      },
      runners: [],
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:29901908",
        name: "Wind 13th Jul",
        country: "GB",
        countryFlag: {
          small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
        },
        venue: "Aintree",
      },
    },
    raceViewLink: {
      viewUrn: "ppb:tbd:view:race:7|1.171782025",
      viewUrl: "horse-racing/chepstow-25th-mar/2m-nov-hrd/r-924.1053675438",
    },
  },
};

const SBK_BET_CARD_FORECAST = {
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
      bonus: 0,
      betType: "SGL",
      currentSize: 0.66,
      numLines: 6,
      isOpen: false,
      isSettled: true,
      betPrice: null,
      legs: [
        {
          type: "CF",
          result: "LOST",
          parts: [
            {
              eventDescription: "17:05 FLAT 2m 0f 125y",
              eventMarketDescription: "Win",
              marketBetUrn: "ppb:marketBet:924.1053675438",
              price: { decimal: 2.2, fractional: { numerator: 6, denominator: 5 } },
              priceType: "DIVIDEND",
              selectionName: "Doctor Ken",
              startTime: "2021-03-24T17:05:00Z",
            },
            {
              eventDescription: "17:05 FLAT 2m 0f 125y",
              eventMarketDescription: "Win",
              marketBetUrn: "ppb:marketBet:924.1053675438",
              price: { decimal: 3.25, fractional: { numerator: 9, denominator: 4 } },
              priceType: "DIVIDEND",
              selectionName: "Unanswered Prayers",
              startTime: "2021-03-24T17:05:00Z",
            },
            {
              eventDescription: "17:05 FLAT 2m 0f 125y",
              eventMarketDescription: "Win",
              marketBetUrn: "ppb:marketBet:924.1053675438",
              price: { decimal: 5.5, fractional: { numerator: 9, denominator: 2 } },
              priceType: "DIVIDEND",
              selectionName: "Mixedwave",
              startTime: "2021-03-24T17:05:00Z",
            },
          ],
        },
      ],

      result: "LOST",
      cashoutQuote: null,
    },
  },
};

const SBK_BET_CARD_FORECAST_RACE_CARD_DETAILS_PARTIALS = {
  node: {
    __typename: "RaceDetailsCard",
    urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|true",
  },
};

const SBK_BET_CARD_FORECAST_PARTIALS = {
  node: {
    __typename: "SportsbookBetCard",
    urn: "ppb:tbd:card:sbkBet:1053675438",
  },
};

const BET_LEG_CARD_FIRST_FORECAST_PARTIAL = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:1053675438/0",
};

const BET_LEG_CARD_FIRST_FORECAST = {
  ...BET_LEG_CARD_FIRST_FORECAST_PARTIAL,
  betUrn: "ppb:sbkBet:1053675438",
  leg: SBK_BET_CARD_FORECAST.node.bet.legs[0],
};

const FIRST_LEG_CARD_GROUP_FORECAST_PARTIAL = {
  __typename: "SportsbookBetLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkBetLeg:1053675438/0",
};

const BET_EXPANDABLE_LEGS_FORECAST_PARTIAL = {
  __typename: "SportsbookExpandableLegCardGroup",
  urn: "ppb:tbd:cardgroup:sbkExpandableLeg:1053675438",
};

const BET_EXPANDABLE_LEGS_FORECAST = {
  ...BET_EXPANDABLE_LEGS_FORECAST_PARTIAL,
  full: {
    edges: [
      {
        node: {
          ...FIRST_LEG_CARD_GROUP_FORECAST_PARTIAL,
          full: {
            edges: [{ node: BET_LEG_CARD_FIRST_FORECAST }, SBK_BET_CARD_FORECAST_RACE_CARD_DETAILS],
          },
          partials: {
            partialEdges: [
              { node: BET_LEG_CARD_FIRST_FORECAST_PARTIAL },
              SBK_BET_CARD_FORECAST_RACE_CARD_DETAILS_PARTIALS,
            ],
          },
        },
      },
      {
        node: {
          ...BET_INFO_ID,
          betReceiptId: "O/11037374/0000372",
        },
      },
    ],
  },
  partials: {
    partialEdges: [{ node: FIRST_LEG_CARD_GROUP_FORECAST_PARTIAL }, { node: BET_INFO_ID }],
  },
};

const BETCARD_GROUP_SBK_BET_CARD_FORECAST = {
  node: {
    __typename: "BetCardGroup",
    urn: "ppb:tbd:card:bet:group:1053675438|sbk",
    full: {
      edges: [SBK_BET_CARD_FORECAST, { node: BET_EXPANDABLE_LEGS_FORECAST }],
    },
    partials: {
      partialEdges: [SBK_BET_CARD_FORECAST_PARTIALS, { node: BET_EXPANDABLE_LEGS_FORECAST_PARTIAL }],
    },
  },
};

/* BFF MY BETS Mocks */
const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_CARDS_SBK_BET, BETCARD_GROUP_CARDS_SBK_BET2],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MY_BETS_MOCK_FORECAST = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  edges: [BETCARD_GROUP_SBK_BET_CARD_FORECAST],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MY_BETS_MOCK_EACH_WAY = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/myBets-open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  settlementLink: "https://support.betfair.com/app/answers/detail/bet-settlement-queries/",
  edges: [BETCARD_GROUP_CARDS_EACH_WAY],
  pageInfo: {
    hasNextPage: "true",
    endCursor: "NA==",
  },
  headerItems: HEADER_ITEMS_MOCK,
};

const BFF_MY_BETS_MOCK_EACH_WAY_SETTLED = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: "mybets/settled/mb-736574746c6564",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 1,
    },
    productType: {
      items: ["SPORTSBOOK"],
      defaultIndex: 1,
    },
  },
  settlementLink: "https://support.betfair.com/app/answers/detail/bet-settlement-queries/",
  edges: [BETCARD_GROUP_CARDS_EACH_WAY],
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

const CARD_NAME = "my_bets_page";

describe("My Bets Page - SBK Single Bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
    await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await startApp("home");
    await BottomBarSO.myBets.waitForDisplayed();
  });

  describe("When the user opens My Bets page with 2 single bets", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4857]_the_two_bet_card_groups_should_be_displayed`);
    });

    it("[PRPI-4857]_the_two_bet_card_groups_should_be_displayed", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4857]_the_two_bet_card_groups_should_be_displayed`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("when expanding the first bet cardgroup", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(
          myBetsScreenSO.sbkBetPanelsCollapsable[0],
          "first panel card is not clickable",
        );
        await myBetsScreenSO.sbkBetPanelsCollapsable[0].click();
        await browser.waitUntilDisplayed(reUseSelectionsButtonSO.element, "Re-use selections button is not displayed");
        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4858]_the_two_bet_card_groups_should_be_displayed_with_reuse_button`,
        );
      });

      afterAll(async () => {
        await browser.waitUntilClickableNative(betDetailsSO.remove);
        await betDetailsSO.remove.click();
      });

      it("[PRPI-4858]_the_two_bet_card_groups_should_be_displayed_with_reuse_button", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4858]_the_two_bet_card_groups_should_be_displayed_with_reuse_button`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });

      describe("and when the user taps 'Re-use selections' CTA button", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(BFF_MARKETS_MOCK));
          await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
          await mockService.mockHttpRequest(
            getImplyBetsResponse({ betCombinations: [BET_COMBINATIONS_MOCK], runnerOdds: [RUNNER_ODDS_MOCK] }),
          );

          await browser.waitUntilClickableNative(
            reUseSelectionsButtonSO.element,
            "Re-use selections button is not clickable",
          );

          await reUseSelectionsButtonSO.element.click();

          await betslipDrawerSO.element.waitForDisplayed();
          await browser.waitUntilStopsMoving(betslipDrawerSO.element);
          await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4859]_should_see_my_bets_page_with_betslip_expanded`);
        });

        it("[PRPI-4859]_should_see_my_bets_page_with_betslip_expanded", async () => {
          expect(
            (await browser.compareScreen(`${CARD_NAME}_[PRPI-4859]_should_see_my_bets_page_with_betslip_expanded`))
              .misMatchPercentage,
          ).toEqual(0);
        });
      });
    });
  });

  describe("When the user opens My Bets page with one each way bet with BOG and BOOST", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_EACH_WAY));
      await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
      await BottomBarSO.home.click();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilEquals(sportsBookBetRaceDetailsSO.meetingName, "Ohi");
      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4860]_the_bet_card_group_should_be_displayed_with_bog_icon_and_boost_label_and_icon`,
      );
    });

    it("[PRPI-4860]_the_bet_card_group_should_be_displayed_with_bog_icon_and_boost_label_and_icon", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4860]_the_bet_card_group_should_be_displayed_with_bog_icon_and_boost_label_and_icon`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("When the user opens My Bets page with a lost ninety minute bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_NINETY));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
      await BottomBarSO.home.click();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);
      await betSelectionDetailsSO.element.isDisplayed();

      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4861]_the_bet_card_group_should_be_displayed_with_the_the_LOST_label_and_90_min_icon`,
      );
    });

    it("[PRPI-4861]_the_bet_card_group_should_be_displayed_with_the_the_LOST_label_and_90_min_icon", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4861]_the_bet_card_group_should_be_displayed_with_the_the_LOST_label_and_90_min_icon`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("When the user opens My Bets page with a lost Forecast bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_FORECAST));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
      await BottomBarSO.home.click();
      await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
      await BottomBarSO.myBets.click();
      await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

      await browser.waitUntilClickableNative(cardSO.element);
      await cardSO.element.click();
      await browser.waitUntilDisplayed(cardSO.contentWrapper);

      await browser.waitUntilEquals(sportsBookBetRaceDetailsSO.meetingName, "Aintree");
      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4862]_the_bet_card_group_should_be_displayed_with_the_country_flag_and_all_selection_names_and_the_lost_label`,
      );
    });

    it("[PRPI-4862]_the_bet_card_group_should_be_displayed_with_the_country_flag_and_all_selection_names_and_the_lost_label", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4862]_the_bet_card_group_should_be_displayed_with_the_country_flag_and_all_selection_names_and_the_lost_label`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });

  describe("When the user opens My Bets page and enter in Settled Bets", () => {
    describe("should be displayed the settled bet and the settlement help link", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_EACH_WAY_SETTLED));
        await browser.waitUntilClickableNative(BottomBarSO.home, "Home button is not clickable");
        await BottomBarSO.home.click();
        await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
        await BottomBarSO.myBets.click();
        await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");

        await browser.waitUntilClickableNative(cardSO.element);
        await cardSO.element.click();
        await browser.waitUntilDisplayed(cardSO.contentWrapper);

        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4863]_should_display_help_icon_when_in_settled_state`);
      });

      it("[PRPI-4863]_should_display_help_icon_when_in_settled_state", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4863]_should_display_help_icon_when_in_settled_state`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
