const {
  AppPO,
  SportPagePO,
  MarketPagePO,
  GenericPagePO,
  ScrollableSwimlanePO,
  ExchangeMarketPO,
  HorseRacingRunnerPO,
  CardPO,
  RaceDetailsPO,
  QuickLinkPO,
  StatusLabelPO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const {
  getMockedImagePuppeteer,
  getMockedNotFoundImageErrorPuppeteer,
} = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  getSportsLayout,
  getCardResults,
  getMarketLayout,
  getRaceLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const quickLinkPO = new QuickLinkPO();

const firstPrimarySwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);

const raceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[0]);
const thirdRaceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[2]);
const fourthRaceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[3]);

const firstRaceDetailsPO = new RaceDetailsPO(raceMarketCardPO.raceDetails);
const firstStatusLabelPO = new StatusLabelPO(raceMarketCardPO.raceDetails);
const thirdStatusLabelPO = new StatusLabelPO(thirdRaceMarketCardPO.raceDetails);

const firstRaceCardPO = new CardPO(raceMarketCardPO.market);

const exchangeMarketPO = new ExchangeMarketPO(firstRaceCardPO.exchangeMarket);
const firstHorseRacingRunnerExchangePO = new HorseRacingRunnerPO(exchangeMarketPO.horseRacingRunnerList[0]);

const marketPagePO = new MarketPagePO();
const marketPageRaceDetailsPO = new RaceDetailsPO(marketPagePO.element);
const marketPageStatusLabelPO = new StatusLabelPO(marketPagePO.element);

const marketCardPO = new CardPO(marketPagePO.market);

const marketExchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const marketFirstHorseRacingRunnerExchangePO = new HorseRacingRunnerPO(marketExchangeMarketPO.horseRacingRunnerList[0]);

const racePagePO = new GenericPagePO();
const racePageRaceDetailsPO = new RaceDetailsPO();
const statusLabelPO = new StatusLabelPO();

const marketCardRaceViewPO = new CardPO(racePagePO.genericViewCards[1]);

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const horseRacingRunners = [
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/16257108",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 16257108,
    horse: {
      name: "Shakalakaboomboom",
      sireName: "KODIAC",
      damName: "SUPREME OCCASION (IRE)",
      damSireName: "TEOFILO (IRE)",
      age: 3,
      color: "BAY",
      sex: "COLT",
    },
    details: {
      jockeyName: "John Velazquez",
      trainerName: "Floki Vahalaa",
      saddleCloth: 4,
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 10,
      type: "FLAT",
    },
    form: "1-15026",
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/29547685",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 29547685,
    horse: {
      name: "DROMISKIN",
      sireName: "DUNADEN (FR)",
      damName: "CEILIDH BAND",
      damSireName: "CELTIC SWING",
      age: 4,
      color: "BAY",
      sex: "FILLY",
    },
    details: {
      jockeyName: "Sophie Ralston",
      trainerName: "Dean Ivory",
      saddleCloth: 1,
      silk: null,
      draw: 2,
    },
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/26374771",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 26374771,
    horse: {
      name: "BACK FROM DUBAI (IRE)",
      sireName: "EXCEED AND EXCEL (AUS)",
      damName: "EMIRATES REWARDS",
      damSireName: "DUBAWI (IRE)",
      age: 3,
      color: "BAY",
      sex: "GELDING",
    },
    details: {
      jockeyName: "Oisin Murphy",
      trainerName: "Saeed bin Suroor",
      saddleCloth: 3,
      silk: null,
      draw: 5,
    },
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/28633350",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 28633350,
    horse: {
      name: "ANGELS ROC",
      sireName: "RODERIC O'CONNOR (IRE)",
      damName: "DIVINE PAMINA (IRE)",
      damSireName: "DARK ANGEL (IRE)",
      age: 3,
      color: "BAY",
      sex: "GELDING",
    },
    details: {
      jockeyName: "Charlie Bennett",
      trainerName: "Jim Boyle",
      saddleCloth: 2,
      silk: null,
      draw: 9,
    },
  },
];

const dummyRaceDetails = {
  __typename: "RaceDetailsCard",
  urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|false",
  numberOfRunners: 14,
  race: {
    __typename: "Race",
    urn: "ppb:race:30061949.1335",
    name: "14:40 Aintree",
    runners: horseRacingRunners,
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:29901908",
      venue: "Aintree",
      countryFlag: {
        medium: "http://example.test.com/mockedImage/image.png",
      },
    },
    details: {
      distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
      going: "Good to firm in places Good to firm in places",
      status: "GOING_DOWN",
      type: "FLAT",
    },
  },
  showMeetingInfo: false,
};

const exchangeRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/16257108/0",
    name: "Shakalakaboomboom",
    selectionId: 16257108,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/29547685/0",
    name: "Dromiskin",
    selectionId: 29547685,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/26374771/0",
    name: "Back From Dubai",
    selectionId: 26374771,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/394559/0",
    name: "Fun And Games",
    selectionId: 394559,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/12198722/0",
    name: "Treatherlikestar",
    selectionId: 12198722,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/14336638/0",
    name: "American Mission",
    selectionId: 14336638,
    handicap: 0,
    resultType: null,
  },
];

const dummyExchangeMarket = {
  __typename: "ExchangeMarket",
  urn: "ppb:excMarket:1.5555555",
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:7",
    name: "Horse Racing",
    sportId: 7,
  },
  hierarchy: {
    __typename: "RaceHierarchy",
    race: {
      __typename: "Race",
      urn: "ppb:race:30061949.1335",
      startTime: "2020-07-13T14:40:00Z",
      name: "14:40 Aintree",
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
  runners: exchangeRunners,
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Horse Racing",
  sport: {
    __typename: "Sport",
    urn: `ppb:eventType:${EVENT_TYPE_ID}`,
    sportId: EVENT_TYPE_ID,
    name: "Horse Racing",
  },
  edges: [
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.171344945",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Aintree",
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
                      runners: exchangeRunners,
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  runners: horseRacingRunners,
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
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
                  viewUrl: "horse-racing/here-13th-oct/r-7|30061949.1335",
                  viewUrn: "ppb:tbd:view:race:7|30061949.1335",
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/16257108/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/16257108/0",
                  },
                ],
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1111111111",
                title: "Second Market",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.5555555",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:1111111111.1335",
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Aintree",
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
                      runners: exchangeRunners,
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:1111111111.1335",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 1, furlongs: 1, yards: 1 },
                    numberOfRunners: 8,
                    going: "GOOD",
                    status: "PARADING",
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
                  viewUrl: "horse-racing/here-13th-oct/r-7|30061949.1335",
                  viewUrn: "ppb:tbd:view:race:7|30061949.1335",
                },
                runnerViewLinks: [],
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:2222222",
                title: "Third Market",
                raceViewLink: {
                  viewUrl: "horse-racing/here-13th-oct/r-7|30061949.1335",
                  viewUrn: "ppb:tbd:view:race:7|30061949.1335",
                },
                runnerViewLinks: [],
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.5555555",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:1111111111.1335",
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Aintree",
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
                      runners: exchangeRunners,
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
                      { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.111111",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "Good to firm in places Good to firm in places",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                    type: "FLAT",
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.111111/16257108",
                      raceURN: "ppb:race:29901908.111111",
                      selectionId: 16257108,
                      horse: {
                        name: "Shakalakaboomboom",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Floki Vahalaa",
                        saddleCloth: "4",
                        draw: 10,
                        silk: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.111111/29547685",
                      raceURN: "ppb:race:29901908.111111",
                      selectionId: 29547685,
                      horse: {
                        name: "DROMISKIN",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                        bred: "IRE",
                      },
                      details: {
                        jockeyName: "Arya Stark Starking Stark Stark Stark",
                        trainerName: "Dean Ivory",
                        saddleCloth: "666",
                        draw: 9,
                        silk: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.111111/26374771",
                      raceURN: "ppb:race:29901908.111111",
                      selectionId: 26374771,
                      horse: {
                        name: "BACK FROM DUBAI (IRE)",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "John Velazquez Figuerote",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: "999",
                        draw: 666,
                        silk: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                  ],

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
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1111111111",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:2222222",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:333333",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:4444444",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:555555",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:66666",
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
      },
    },
  ],
};

const BFF_MARKET_VIEW_MOCK = {
  __typename: "MarketView",
  urn: "ppb:tbd:view:market:1.171344945",
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|true",
        numberOfRunners: 14,
        race: {
          __typename: "Race",
          urn: "ppb:race:30061949.1336",
          startTime: "2020-07-13T14:10:00Z",
          name: "14:10 Aintree",
          runners: horseRacingRunners,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901909",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "Good to firm in places Good to firm in places",
            status: "DORMANT",
          },
        },
        showMeetingInfo: true,
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.241938538",
        cardTitle: "Win",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.171344945",
            viewUrl: "horse-racing/hunt-13th-oct/2m7f-hcap-chs/rc-1.171344945",
          },
        ],

        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race: {
            __typename: "Race",
            startTime: "2020-07-13T14:10:00Z",
            name: "Novice Stakes",
            urn: "ppb:race:30061949.1335",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
            },
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
          },
        },
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.171344945",
              name: "1m2f Nov Stks",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                },
              },
              runners: exchangeRunners,
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
              { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
              { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
              { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
              { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
            ],
          },
        },
      },
    },
    {
      // this card is duplicated to ensure that when scrolling to more than 100% from top, SCA poller is active
      node: {
        __typename: "MarketExtendedCard",
        urn: "ppb:tbd:card:marketExtended:1.171344945;924.241938538",
        cardTitle: "Win",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.171344945",
            viewUrl: "/horse-racing/hunt-13th-oct/2m7f-hcap-chs/market:1.171344945",
          },
        ],

        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race: {
            __typename: "Race",
            startTime: "2020-07-13T14:10:00Z",
            name: "Novice Stakes",
            urn: "ppb:race:30061949.1335",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
            },
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
          },
        },
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.171344945",
              name: "1m2f Nov Stks",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                },
              },
              runners: exchangeRunners,
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
              { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
              { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
              { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
              { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:view:race:7|30061949.1335",
        links: [
          {
            label: "2m7f Hcap Chs",
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30061949.1335",
              viewUrl: "horse-racing/hunt-13th-oct/r-7%7C30061949.1335",
            },
          },
        ],
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  url: "horse-racing/clairefontaine-3rd-aug/r-7|30061949.1335",
  urn: "ppb:tbd:view:race:7|30061949.1335",
  race: {
    __typename: "Race",
    urn: "ppb:race:30061949.1335",
    name: "14:40 Aintree",
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:29901908",
      venue: "Aintree",
    },
  },
  edges: [
    {
      node: dummyRaceDetails,
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
        cardTitle: "Win",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.171344945",
              name: "1m2f Nov Stks",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "Horse Racing",
                sportId: 7,
              },
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  name: "14:40 Aintree",
                  runners: horseRacingRunners,
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    venue: "Aintree",
                    countryFlag: {
                      medium: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                  venue: "Aintree",
                  countryFlag: {
                    medium: "http://example.test.com/mockedImage/image.png",
                  },
                },
              },
              runners: exchangeRunners,
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
              { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
            ],
          },
        },
        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race: {
            __typename: "Race",
            urn: "ppb:race:30061949.1335",
            name: "14:40 Aintree",
            runners: horseRacingRunners,
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              venue: "Aintree",
              countryFlag: {
                medium: "http://example.test.com/mockedImage/image.png",
              },
            },
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
        },
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.171344945",
            viewUrl: "horse-racing/here-13th-oct/3m1f-hcap-hrd/rc-1.171344945",
          },
        ],

        runnerViewLinks: [],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|false",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: "1.171344945",
    runners: [
      {
        selectionId: "16257108",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "29547685",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "26374771",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
      {
        selectionId: "28633350",
        availableToBack: [{ price: 4.1, size: 300 }],
        availableToLay: [{ price: 4.2, size: 310 }],
      },
    ],
  },
];

const CARDS_MOCK = {
  cards: [
    {
      __typename: "RaceMarketCard",
      urn: "ppb:tbd:card:raceMarket:4444444",
      title: "Fifth Market",
      numberOfRunners: 14,
      displayRunners: {
        exchange: {
          market: dummyExchangeMarket,
          runners: [
            { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
            { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
            { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
            { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
            { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
          ],
        },
      },
      race: {
        urn: "ppb:race:30061949.1335",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:29901908",
        },
      },
    },
    {
      __typename: "RaceMarketCard",
      urn: "ppb:tbd:card:raceMarket:555555",
      title: "Sixth Market",
      numberOfRunners: 12,
      displayRunners: {
        exchange: {
          market: dummyExchangeMarket,
          runners: [
            { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
            { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
            { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
            { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
            { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
          ],
        },
      },
      race: {
        urn: "ppb:race:30061949.1335",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:29901908",
        },
      },
    },
    {
      __typename: "RaceMarketCard",
      numberOfRunners: 1,
      urn: "ppb:tbd:card:raceMarket:66666",
      title: "Seventh Market",
      displayRunners: {
        exchange: {
          market: dummyExchangeMarket,
          runners: [
            { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
            { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
            { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
            { runnerURN: "ppb:excRunner:1.174705115/12198722/0" },
            { runnerURN: "ppb:excRunner:1.174705115/14336638/0" },
          ],
        },
      },
      race: {
        urn: "ppb:race:30061949.1335",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:29901908",
        },
      },
    },
  ],
};

const SCA_RACES_MOCK = {
  race: [
    {
      id: "30061949.1335",
      details: {
        status: "AT_THE_POST",
      },
    },
    {
      id: "29901908.111111",
      details: {
        status: "GOING_BEHIND",
      },
    },
  ],
};

const SCA_MARKET_VIEW_RACE_MOCK = {
  race: [
    {
      id: "30061949.1336",
      details: {
        status: "OFF",
      },
    },
    {
      id: "30061949.1335",
      details: {
        status: "OFF",
      },
    },
  ],
};

const LBR_MOCK = {
  marketPositions: [
    {
      marketId: "1.171344945",
    },
    {
      marketId: "1.5555555",
    },
  ],
};
describe("Horse Racing", () => {
  describe("Navigate to Horse Racing page (/horse-racing), BFF retrieves 1 swimlane named 'Next Races' with 7 racing market cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, {
          currentUrl: routes.getRacingViewUrl(false),
        }),
      );
      await mockService.mockHttpRequest(getMockedNotFoundImageErrorPuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
      await browser.url(routes.getRacingViewUrl());

      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 1.1, isHorseRacing: true }),
      );
    });

    it("[PRPI-8517] Then I should see HR page is shown (/horse-racing)", async () => {
      expect(await browser.getUrl()).toContain(routes.getRacingViewUrl(false));
    });

    it("[PRPI-8518] And I should see a swimlane named 'Next Races'", async () => {
      expect(await firstPrimarySwimlanePO.title.getText()).toBe("Next Races");
    });

    it("[PRPI-8519] And I should see a total of 7 racing market cards at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItems.length).toBe(7);
    });

    it("[PRPI-8520] And I should see a total of 4 placeholders for racing market cards at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItemsPlaceholders.length).toBe(4);
    });

    it("[PRPI-8521] And I should see the first racing market card on the viewport with '15:40 Aintree'", async () => {
      expect(await firstRaceCardPO.element.isDisplayedInViewport()).toBe(true);
      expect(await firstRaceDetailsPO.raceTime.getText()).toBe("15:40");
      expect(await firstRaceDetailsPO.meetingName.getText()).toBe("Aintree");
    });

    it("[PRPI-8522] And I should see the country flag", async () => {
      expect(await firstRaceDetailsPO.flag.isDisplayed()).toBe(true);
    });

    it("[PRPI-8523] And I should see the racing market 'Win'", async () => {
      expect(await firstRaceCardPO.title.getText()).toContain("Win");
    });

    it("[PRPI-8524] And I should see the top 3 HR runners", async () => {
      expect(await exchangeMarketPO.horseRacingRunnerList.length).toBe(3);
    });

    it("[PRPI-8525] And I should see the default horse silk", async () => {
      expect(await firstHorseRacingRunnerExchangePO.runnerDefaultSilk.isDisplayed()).toBe(true);
    });

    it("[PRPI-8526] And I should see the first runner name 'Shakalakaboomboom'", async () => {
      expect(await firstHorseRacingRunnerExchangePO.horseName.getText()).toBe("Shakalakaboomboom");
    });

    it("[PRPI-8527] And I should see the first runner number '4'", async () => {
      expect(await firstHorseRacingRunnerExchangePO.horseNumber.getText()).toBe("4");
    });

    it("[PRPI-8528] And I should see the first Jockey name 'John Velazquez'", async () => {
      expect(await firstHorseRacingRunnerExchangePO.jockeyName.getText()).toContain("Jockey: John Velazquez");
    });

    it("[PRPI-8529] And I should see the trainer name 'Trainer: Floki Vahalaa'", async () => {
      expect(await firstHorseRacingRunnerExchangePO.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
    });

    it("[PRPI-8530] And I should see the form info 'F: 1-15026 | Age: 3'", async () => {
      expect(await firstHorseRacingRunnerExchangePO.form.getText()).toBe("F: 1-15026 | Age: 3");
    });

    describe("Next SCA request is automatically triggered, SCA retrieves new RaceStatus 'At The Post' for 1st card", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntil(async () => (await firstStatusLabelPO.text.getText()) === "At The Post");
      });

      it("[PRPI-8531] Then I should see 1st card race status updated to 'At The Post'", async () => {
        expect(await firstStatusLabelPO.text.getText()).toContain("At The Post");
      });
    });

    describe("Swipe right till the 3rd card, SCA retrieves the same RaceStatus 'Going Behind' for the 3rd card", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK));
        // scroll to card before getting update from SCA
        await firstPrimarySwimlanePO.scrollItems[2].scrollIntoView();
        await browser.waitUntilInViewport(thirdRaceMarketCardPO.element);
        await browser.tickFakeClock();
        await browser.waitUntil(async () => (await thirdStatusLabelPO.text.getText()) === "Going Behind");
      });

      it("[PRPI-8532] Then I should see the third and the fourth racing market cards on the viewport", async () => {
        expect(await thirdRaceMarketCardPO.element.isDisplayedInViewport()).toBe(true);
        expect(await fourthRaceMarketCardPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-8533] And I should see a total of 6 racing market cards on the page", async () => {
        // race ppb:tbd:card:raceMarket:333333 is deleted since there is no info
        expect(await firstPrimarySwimlanePO.scrollItems.length).toBe(6);
      });

      it("[PRPI-8533] And I should see the race status 'Going Behind'", async () => {
        expect(await thirdStatusLabelPO.text.getText()).toContain("Going Behind");
      });
    });
  });

  describe("Tap on first runner of 1st racing market card 'Shakalakaboomboom', BFF retrieves runner optional and mandatory fields for that runner", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await browser.url(routes.getRacingViewUrl());

      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 1.1, isHorseRacing: true }),
      );

      await firstHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].click();
      await browser.waitUntilBrowserUrlContains("r-7%7C30061949.1335");
    });

    it("[PRPI-8534] Then I should see the race page opens", async () => {
      expect(await browser.getUrl()).toContain("r-7%7C30061949.1335");
    });
  });

  describe("Navigate to Horse Racing page (/horse-racing) And tap on the 'Win' market name '14:40 Aintree' of the first race with 6 runners", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, {
          currentUrl: routes.getRacingViewUrl(false),
        }),
      );
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntilDisplayed(firstRaceCardPO.title);
      await firstRaceCardPO.title.waitForClickable();
      await firstRaceCardPO.title.click();
      await browser.waitUntilDisplayed(marketCardRaceViewPO.title);
      await marketCardRaceViewPO.title.waitForClickable();
    });

    it("[PRPI-8535] I should see race page for that race", async () => {
      expect(await browser.getUrl()).toContain("r-7%7C30061949.1335");
    });

    describe("When i tap on the 'Win' market name on the race page", () => {
      beforeAll(async () => {
        await marketCardRaceViewPO.title.click();
        await browser.waitUntilDisplayed(marketPagePO.market);
      });

      it("[PRPI-8536] Then I should see the market page for that race is shown", async () => {
        expect(await marketPagePO.market.isDisplayed()).toBe(true);
      });

      it("[PRPI-8537] And I should see the race details with no Race Status info available", async () => {
        expect(await marketPageStatusLabelPO.text.isDisplayed()).toBe(false);
      });

      it("[PRPI-8538] And I should see a country flag", async () => {
        expect(await marketPageRaceDetailsPO.flag.isDisplayed()).toBe(true);
      });

      it("[PRPI-8539] And I should see the race start time '15:10'", async () => {
        expect(await marketPageRaceDetailsPO.raceTime.getText()).toBe("15:10");
      });

      it("[PRPI-8540] And I should see the meeting name 'Aintree'", async () => {
        expect(await marketPageRaceDetailsPO.meetingName.getText()).toBe("Aintree");
      });

      it("[PRPI-8541] And I should see the racing market 'Win' inside market card", async () => {
        expect(await marketCardPO.title.isDisplayed()).toBe(true);
        expect(await marketCardPO.title.getText()).toBe("Win");
      });

      it("[PRPI-8542] And I should see the first horse silk", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.runnerSilk.isDisplayed()).toBe(true);
      });

      it("[PRPI-8543] And I should see the first runner name 'Shakalakaboomboom'", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.horseName.getText()).toBe("Shakalakaboomboom");
      });

      it("[PRPI-8544] And I should see the first runner number '4'", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.horseNumber.getText()).toBe("4");
      });

      it("[PRPI-8545] And I should see the first Jockey name 'John Velazquez'", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.jockeyName.getText()).toContain("Jockey: John Velazquez");
      });

      it("[PRPI-8546] And I should see the first draw number '(10)'", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.jockeyNumber.getText()).toBe("(10)");
      });

      it("[PRPI-8547] And I should see the trainer name 'Trainer: Floki Vahalaa'", async () => {
        expect(await marketFirstHorseRacingRunnerExchangePO.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
      });

      it("[PRPI-8548] And I should see 6 runners at page load", async () => {
        expect(await marketExchangeMarketPO.horseRacingRunnerList.length).toBe(6);
      });

      describe("When I scroll down till I see Race quick link", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getScaResponse(SCA_MARKET_VIEW_RACE_MOCK));
          await quickLinkPO.element.scrollIntoView();
          await browser.waitUntilInViewport(quickLinkPO.element, "Race quick link not in viewport");
        });

        describe("And race status changes to 'Off'", () => {
          beforeAll(async () => {
            await browser.tickFakeClock();
            await browser.waitUntil(async () => (await statusLabelPO.text.getText()) === "Off");
          });

          it("[PRPI-8549] Then I should see the race details with 'Off' race status", async () => {
            expect(await statusLabelPO.text.getText()).toBe("Off");
          });
        });

        describe("When I tap on the quickLinkCard", () => {
          beforeAll(async () => {
            await quickLinkPO.element.waitForClickable();
            await quickLinkPO.element.click();
            await browser.waitUntilDisplayed(racePageRaceDetailsPO.raceInfo);
            await browser.waitUntil(async () => (await statusLabelPO.text.getText()) === "Off");
          });

          it("[PRPI-8549] Then I should see the race page for that race is shown", async () => {
            expect(await browser.getUrl()).toContain("r-7%7C30061949.1335");
          });

          it("[PRPI-8549] And I should see the race details with 'Off' race status", async () => {
            expect(await statusLabelPO.text.getText()).toBe("Off");
          });

          describe("When I tap on the 'Win' market", () => {
            beforeAll(async () => {
              await marketCardRaceViewPO.title.click();
              await browser.waitUntilDisplayed(marketPagePO.marketTitle);
            });

            it("[PRPI-8549] Then I should see the market card title for that race is shown again", async () => {
              expect(await marketPagePO.marketTitle.getText()).toBe("Win");
            });

            describe("When I tap on the first runner", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
                await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
                await browser.url(routes.getRacingViewUrl());

                await firstHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].click();
                await browser.waitUntilBrowserUrlContains("r-7%7C30061949.1335");
              });

              it("[PRPI-8549] Then I should see the race page opens", async () => {
                expect(await browser.getUrl()).toContain("r-7%7C30061949.1335");
              });
            });
          });
        });
      });
    });
  });
});
