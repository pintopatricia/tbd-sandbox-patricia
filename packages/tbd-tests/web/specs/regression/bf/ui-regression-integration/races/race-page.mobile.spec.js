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
  SportsbookMarketPO,
  NonRunnerPO,
  StatusLabelPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const {
  getSportsLayout,
  getRaceLayout,
  getBettingCardDisplayRunners,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const PriceHistoryPO = require("@ppb/tbd-shared/components/PriceHistory/PriceHistory.po");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const sportPage = new SportPagePO();
const marketPagePO = new MarketPagePO();
const racePagePO = new GenericPagePO();
const firstPrimarySwimlanePO = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const raceMarketCardPO = new RaceMarketCardPO(sportPage.scrollableSwimlanes[0]);
const marketCardPO = new CardPO(marketPagePO.market);
const firstRaceDetailsPO = new RaceDetailsPO(raceMarketCardPO.raceDetails);
const firstRaceCardPO = new CardPO(raceMarketCardPO.market);

const exchangeMarket = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const firstRunner = new HorseRacingRunnerPO(exchangeMarket.horseRacingRunnerList[0]);

const sportsBookMarketPO = new SportsbookMarketPO(marketCardPO.sportsbookMarket);
const firstSbkHrRunner = sportsBookMarketPO.horseRacingRunnerList[0];
const secondSbkHrRunner = sportsBookMarketPO.horseRacingRunnerList[1];

const firstSbkHorseRacingRunnerPO = new HorseRacingRunnerPO(firstSbkHrRunner);
const firstSbkHorseRacingRunnerPriceHistoryPO = new PriceHistoryPO(firstSbkHorseRacingRunnerPO.element);
const secondSbkHorseRacingRunnerPO = new HorseRacingRunnerPO(secondSbkHrRunner);
const secondSbkHorseRacingRunnerPriceHistoryPO = new PriceHistoryPO(secondSbkHorseRacingRunnerPO.element);

const secondSbkHorseRacingRunnerNonRunnerPO = new NonRunnerPO(secondSbkHrRunner);

const statusLabelPO = new StatusLabelPO(racePagePO.element);

const mockService = new MockService();

const EVENT_TYPE_ID = 7;
const RACE_ID = "29901908.1410";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  sport: {
    __typename: "Sport",
    urn: `ppb:eventType:1${EVENT_TYPE_ID}`,
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
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
                raceViewLink: {
                  viewUrn: "ppb:tbd:view:race:29901908.1410",
                  viewUrl: routes.getRaceViewUrl("7", "29901908.1410"),
                },
                title: "Win",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1410",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    type: "FLAT",
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1410/16257108",
                      raceURN: "ppb:race:29901908.1410",
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
                        silk: null,
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1410/29547685",
                      raceURN: "ppb:race:29901908.1410",
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
                        jockeyName: "Arya Stark Starking Stark Stark Stark",
                        trainerName: "Dean Ivory",
                        saddleCloth: 666,
                        silk: null,
                        draw: 9,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1410/26374771",
                      raceURN: "ppb:race:29901908.1410",
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
                        saddleCloth: 999,
                        silk: null,
                        draw: 666,
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
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.171344945",
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
                          urn: "ppb:race:29901908.1410",
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
                      competition: {
                        sport: {
                          __typename: "Sport",
                          name: "Horse Racing",
                          sportId: 7,
                          urn: "ppb:eventType:7",
                        },
                      },
                      runners: [
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
                          name: "John Snow Snowing Snowing Snowing",
                          selectionId: 29547685,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.171344945/26374771/0",
                          name: "Shakalala",
                          selectionId: 26374771,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                    ],
                  },
                },
                numberOfRunners: 14,
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1420;WIN|3",
                raceViewLink: {
                  viewUrn: "ppb:tbd:view:race:29901908.1420",
                  viewUrl: routes.getRaceViewUrl("7", "29901908.1420"),
                },
                title: "Win",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1420",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    type: "FLAT",
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1420/16257108",
                      raceURN: "ppb:race:29901908.1420",
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
                        trainerName: "Richard Hannon",
                        saddleCloth: 4,
                        silk: null,
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1420/29547685",
                      raceURN: "ppb:race:29901908.1420",
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
                        jockeyName: "Arya Stark Starking Stark Stark Stark",
                        trainerName: "Dean Ivory",
                        saddleCloth: 666,
                        silk: null,
                        draw: 9,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1420/26374771",
                      raceURN: "ppb:race:29901908.1420",
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
                        saddleCloth: 999,
                        silk: null,
                        draw: 666,
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
                          urn: "ppb:race:29901908.1420",
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Aintree",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: {
                              vector: "http://example.test.com/mockedImage/image.png",
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
                      competition: {
                        sport: {
                          __typename: "Sport",
                          name: "Horse Racing",
                          sportId: 7,
                          urn: "ppb:eventType:7",
                        },
                      },
                      runners: [
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
                          name: "John Snow Snowing Snowing Snowing",
                          selectionId: 29547685,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.171344945/26374771/0",
                          name: "Shakalala",
                          selectionId: 26374771,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                    ],
                  },
                },
                numberOfRunners: 14,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1420;WIN|3",
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

const marketCardSbkMock = {
  __typename: "MarketCard",
  cardTitle: "Win",
  displayRunners: {
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.193270252",
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
            urn: "ppb:race:29901908.1410",
            startTime: "2020-07-13T14:40:00Z",
            name: "Aintree",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                vector: "http://example.test.com/mockedImage/image.png",
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
              vector: "http://example.test.com/mockedImage/image.png",
            },
            venue: "Aintree",
          },
        },
        competition: {
          sport: {
            __typename: "Sport",
            name: "Horse Racing",
            sportId: 7,
            urn: "ppb:eventType:7",
          },
        },
        runners: [
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/16257108",
            name: "Shakalakaboomboom",
            selectionId: 16257108,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/29547685",
            name: "John Snow Snowing Snowing Snowing",
            selectionId: 29547685,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/26374771/0",
            name: "Shakalala",
            selectionId: 26374771,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/16257101/0",
            name: "Shakalakaboomboom",
            selectionId: 16257101,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/29547681/0",
            name: "John Snow Snowing Snowing Snowing",
            selectionId: 29547681,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:sbkRunner:924.193270252/26374772/0",
            name: "Shakalala",
            selectionId: 26374772,
            handicap: 0,
            resultType: null,
          },
        ],
      },
      runners: [
        { runnerURN: "ppb:sbkRunner:924.193270252/16257108" },
        { runnerURN: "ppb:sbkRunner:924.193270252/29547685" },
        { runnerURN: "ppb:sbkRunner:924.193270252/26374771/0" },
        { runnerURN: "ppb:sbkRunner:924.193270252/16257101/0" },
        { runnerURN: "ppb:sbkRunner:924.193270252/29547681/0" },
        { runnerURN: "ppb:sbkRunner:924.193270252/26374772/0" },
      ],
    },
  },
};

const marketCardExcMock = {
  __typename: "MarketCard",
  cardTitle: "Win",
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
            urn: "ppb:race:29901908.1410",
            startTime: "2020-07-13T14:40:00Z",
            name: "Aintree",
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901908",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                vector: "http://example.test.com/mockedImage/image.png",
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
              vector: "http://example.test.com/mockedImage/image.png",
            },
            venue: "Aintree",
          },
        },
        competition: {
          sport: {
            __typename: "Sport",
            name: "Horse Racing",
            sportId: 7,
            urn: "ppb:eventType:7",
          },
        },
        runners: [
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
            name: "John Snow Snowing Snowing Snowing",
            selectionId: 29547685,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.171344945/26374771/0",
            name: "Shakalala",
            selectionId: 26374771,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.171344945/16257101/0",
            name: "Shakalakaboomboom",
            selectionId: 16257101,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.171344945/29547681/0",
            name: "John Snow Snowing Snowing Snowing",
            selectionId: 29547681,
            handicap: 0,
            resultType: null,
          },
          {
            __typename: "Runner",
            runnerURN: "ppb:excRunner:1.171344945/26374772/0",
            name: "Shakalala",
            selectionId: 26374772,
            handicap: 0,
            resultType: null,
          },
        ],
      },
      runners: [
        { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
        { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
        { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
        { runnerURN: "ppb:excRunner:1.171344945/16257101/0" },
        { runnerURN: "ppb:excRunner:1.171344945/29547681/0" },
        { runnerURN: "ppb:excRunner:1.171344945/26374772/0" },
      ],
    },
  },
};

const marketCardUpdateSbkMock = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
      displayRunners: {
        sportsbook: {
          runners: [
            { runnerURN: "ppb:sbkRunner:924.193270252/16257108" },
            { runnerURN: "ppb:sbkRunner:924.193270252/29547685" },
            { runnerURN: "ppb:sbkRunner:924.193270252/26374771/0" },
            { runnerURN: "ppb:sbkRunner:924.193270252/16257101/0" },
            { runnerURN: "ppb:sbkRunner:924.193270252/29547681/0" },
            { runnerURN: "ppb:sbkRunner:924.193270252/26374772/0" },
          ],
        },
      },
    },
  ],
};

const marketCardUpdateExcMock = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
      displayRunners: {
        exchange: {
          runners: [
            { runnerURN: "ppb:excRunner:1.171344945/26374772/0" },
            { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
            { runnerURN: "ppb:excRunner:1.171344945/16257101/0" },
            { runnerURN: "ppb:excRunner:1.171344945/29547681/0" },
            { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
          ],
        },
      },
    },
  ],
};

const BFF_SBK_RACE_VIEW_MOCK = {
  url: `/horse-racing/clairefontaine-3rd-aug/r-${RACE_ID}`,
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  race: {
    urn: `ppb:tbd:view:race:${RACE_ID}`,
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
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        numberOfRunners: 14,
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
          runners: [
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/16257108",
              raceURN: "ppb:race:29901908.1410",
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
              },
              form: "1-15026",
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/29547685",
              raceURN: "ppb:race:29901908.1410",
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
                jockeyName: "Arya Stark Starking Stark Stark Stark",
                trainerName: "Dean Ivory",
                saddleCloth: 666,
                silk: null,
                draw: 9,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/26374771",
              raceURN: "ppb:race:29901908.1410",
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
                saddleCloth: 999,
                silk: null,
                draw: 666,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/16257101",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 16257101,
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
                trainerName: "Richard Hannon",
                saddleCloth: 4,
                silk: null,
                draw: 10,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/29547681",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 29547681,
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
                jockeyName: "Arya Stark Starking Stark Stark Stark",
                trainerName: "Dean Ivory",
                saddleCloth: 666,
                silk: null,
                draw: 9,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/26374772",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 26374772,
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
                saddleCloth: 999,
                silk: null,
                draw: 666,
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
    {
      node: {
        ...marketCardSbkMock,
        urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
      },
    },
  ],
};

const BFF_EXC_RACE_VIEW_MOCK = {
  url: `/horse-racing/clairefontaine-3rd-aug/r-${RACE_ID}`,
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  race: {
    urn: `ppb:tbd:view:race:${RACE_ID}`,
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
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        numberOfRunners: 14,
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
          runners: [
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/16257108",
              raceURN: "ppb:race:29901908.1410",
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
              },
              form: "1-15026",
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/29547685",
              raceURN: "ppb:race:29901908.1410",
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
                jockeyName: "Arya Stark Starking Stark Stark Stark",
                trainerName: "Dean Ivory",
                saddleCloth: 666,
                silk: null,
                draw: 9,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/26374771",
              raceURN: "ppb:race:29901908.1410",
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
                saddleCloth: 999,
                silk: null,
                draw: 666,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/16257101",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 16257101,
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
                trainerName: "Richard Hannon",
                saddleCloth: 4,
                silk: null,
                draw: 10,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/29547681",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 29547681,
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
                jockeyName: "Arya Stark Starking Stark Stark Stark",
                trainerName: "Dean Ivory",
                saddleCloth: 666,
                silk: null,
                draw: 9,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:29901908.1410/26374772",
              raceURN: "ppb:race:29901908.1410",
              selectionId: 26374772,
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
                saddleCloth: 999,
                silk: null,
                draw: 666,
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
    {
      node: {
        ...marketCardExcMock,
        urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
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
        availableToBack: [{ price: 3.1, size: 100 }],
        availableToLay: [{ price: 3.2, size: 110 }],
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
        selectionId: "16257101",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "29547681",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "26374772",
        availableToBack: [{ price: 1.1, size: 300 }],
        availableToLay: [{ price: 1.2, size: 310 }],
      },
    ],
  },
];

const SCA_RACES_MOCK = {
  race: [
    {
      id: "29901908.1410",
      details: {
        status: "OFF",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "16257108",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
          ],
        },
        {
          selectionId: "29547685",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 2.2 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_UPDATED_PREVIOUS_ODDS_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      marketStatus: "OPEN",
      runnerDetails: [
        {
          selectionId: "16257108",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.5 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.6 },
            },
          ],
        },
        {
          selectionId: "29547685",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 2.5 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "16257108",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.5 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.6 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_TURNS_INPLAY_MOCK = {
  markets: [
    {
      ...SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK.markets[0],
      inplay: true,
    },
  ],
};

const LBR_MOCK = {
  marketPositions: [
    {
      marketId: "1.171344945",
    },
  ],
};

describe("[689583] When I navigate to Horse Racing page with 2 Next Races", () => {
  describe("Exchange Vertical", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, {
          currentUrl: routes.getRacingViewUrl(false),
        }),
      );
      await mockService.mockHttpRequest(getBettingCardDisplayRunners(marketCardUpdateExcMock));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_EXC_RACE_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 3.1, isHorseRacing: true }),
      );
    });

    it("[PRPI-7323] then I should see HR page is shown", async () => {
      expect(await browser.getUrl()).toContain(routes.getRacingViewUrl());
    });

    it("[PRPI-7324] and I should see a swimlane named 'Next Races'", async () => {
      expect(await firstPrimarySwimlanePO.title.getText()).toBe("Next Races");
    });

    it("[PRPI-7325] and I should see a total of 2 race market cards at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItems.length).toBe(2);
    });

    it("[PRPI-7326] and I should see the first race market card on the viewport with '15:40 Aintree'", async () => {
      expect(await firstRaceCardPO.element.isDisplayedInViewport()).toBe(true);
      expect(await firstRaceDetailsPO.raceTime.getText()).toBe("15:40");
      expect(await firstRaceDetailsPO.meetingName.getText()).toBe("Aintree");
    });

    it("[PRPI-7327] and I should see the country flag", async () => {
      expect(await firstRaceDetailsPO.flag.isDisplayed()).toBe(true);
    });

    describe('When I tap on Next Races swimlane first race market card "14:40 Aintree" and BFF is retrieving 6 runners for that race with all meeting, race and runner mandatory and optional fields', () => {
      beforeAll(async () => {
        await raceMarketCardPO.raceDetails.click();
        await browser.waitUntilDisplayed(racePagePO.element);
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({ market: racePagePO.element, price: 3.1, isHorseRacing: true }),
        );
      });

      it("[PRPI-7328] then I should see HR racecard page is shown", async () => {
        expect(await browser.getUrl()).toContain(BFF_EXC_RACE_VIEW_MOCK.url);
      });

      it("[PRPI-7328] and I should see the race details card with 'Going Down' race status", async () => {
        expect(await statusLabelPO.text.getText()).toBe("Going Down");
      });

      it("[PRPI-7328] and I should see the racing market 'Win'", async () => {
        expect(await marketCardPO.title.getText()).toContain("Win");
      });

      it("[PRPI-7328] and I should see the first horse silk", async () => {
        expect(await firstRunner.runnerSilk.isDisplayed()).toBe(true);
      });

      it("[PRPI-7328] and I should see the first runner name 'Shakalakaboomboom'", async () => {
        expect(await firstRunner.horseName.getText()).toBe("Shakalakaboomboom");
      });

      it("[PRPI-7328] and I should see the first runner number '4'", async () => {
        expect(await firstRunner.horseNumber.getText()).toBe("4");
      });

      it("[PRPI-7328] and I should see the first Jockey name 'John Velazquez'", async () => {
        expect(await firstRunner.jockeyName.getText()).toContain("Jockey: John Velazquez");
      });

      it("[PRPI-7328] and I should see the first draw number '(10)'", async () => {
        expect(await firstRunner.jockeyNumber.getText()).toBe("(10)");
      });

      it("[PRPI-7328] and I should see the trainer name 'Trainer: Floki Vahalaa'", async () => {
        expect(await firstRunner.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
      });

      it("[PRPI-7328] and I should see the form info 'F: 1-15026 | Age: 3'", async () => {
        expect(await firstRunner.form.getText()).toBe("F: 1-15026 | Age: 3");
      });

      it("[PRPI-7328] and I should see a total of 6 runners at page load", async () => {
        expect(await exchangeMarket.horseRacingRunnerList.length).toBe(6);
      });

      describe("and the market turns inplay", () => {
        beforeAll(async () => {
          await browser.tickFakeClock();

          await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK));
          await browser.tickFakeClock();

          await browser.waitUntilEquals(statusLabelPO.text, "Off");
        });

        it("[PRPI-7328] then I should see race status updated to 'Off'", async () => {
          expect(await statusLabelPO.text.getText()).toBe("Off");
        });
      });
    });
  });

  describe("Sportsbook vertical", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, {
          currentUrl: routes.getRacingViewUrl(false),
        }),
      );
      await mockService.mockHttpRequest(getBettingCardDisplayRunners(marketCardUpdateSbkMock));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_SBK_RACE_VIEW_MOCK));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 3.1, isHorseRacing: true }),
      );
    });

    it("[PRPI-7329] then I should see HR page is shown", async () => {
      expect(await browser.getUrl()).toContain(routes.getRacingViewUrl(false));
    });

    it("[PRPI-7330] and I should see a swimlane named 'Next Races'", async () => {
      expect(await firstPrimarySwimlanePO.title.getText()).toBe("Next Races");
    });

    it("[PRPI-7331] and I should see a total of 2 race market cards at page load", async () => {
      expect(await firstPrimarySwimlanePO.scrollItems.length).toBe(2);
    });

    it("[PRPI-7332] and I should see the first race market card on the viewport with '15:40 Aintree'", async () => {
      expect(await firstRaceCardPO.element.isDisplayedInViewport()).toBe(true);
      expect(await firstRaceDetailsPO.raceTime.getText()).toBe("15:40");
      expect(await firstRaceDetailsPO.meetingName.getText()).toBe("Aintree");
    });

    it("[PRPI-7333] and I should see the country flag", async () => {
      expect(await firstRaceDetailsPO.flag.isDisplayed()).toBe(true);
    });

    describe('When I tap on Next Races swimlane first race market card "14:40 Aintree" and BBF is retrieving 6 runners for that race with all meeting, race and runner mandatory and optional fields', () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
        await raceMarketCardPO.raceDetails.click();
        await browser.waitUntilDisplayed(racePagePO.element);
        await browser.waitUntilDisplayed(statusLabelPO.element);
        await browser.tickFakeClock();
        await browser.waitUntilDisplayed(firstSbkHorseRacingRunnerPO.sportsbookBetButton);
      });

      describe("When price history is retrieved for SBK runners", () => {
        beforeAll(async () => {
          await browser.waitUntilEquals(firstSbkHorseRacingRunnerPriceHistoryPO.value, "1.3 ▸ 1.2 ▸ 1.1");
        });

        it("[PRPI-7334] The 3 previous odds for the 1st runner should be visible: '1.3 \u25B8 1.2 \u25B8 1.1'", async () => {
          expect(await firstSbkHorseRacingRunnerPriceHistoryPO.value.getText()).toBe("1.3 ▸ 1.2 ▸ 1.1");
        });

        it("[PRPI-7334] The 2 previous odds for the 2nd runner should be visible: '2.2 \u25B8 2.1'", async () => {
          expect(await secondSbkHorseRacingRunnerPriceHistoryPO.value.getText()).toBe("2.2 ▸ 2.1");
        });

        describe("and the previous odds are updated", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_UPDATED_PREVIOUS_ODDS_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilEquals(firstSbkHorseRacingRunnerPriceHistoryPO.value, "1.6 ▸ 1.5 ▸ 1.4");
          });

          it("[PRPI-7334] The 3 previous odds for the 1st runner should be visible: '1.6 \u25B8 1.5 \u25B8 1.4'", async () => {
            expect(await firstSbkHorseRacingRunnerPriceHistoryPO.value.getText()).toBe("1.6 ▸ 1.5 ▸ 1.4");
          });

          it("[PRPI-7334] The 2 previous odds for the 2nd runner should be visible: '2.5 \u25B8 2.4'", async () => {
            expect(await secondSbkHorseRacingRunnerPriceHistoryPO.value.getText()).toBe("2.5 ▸ 2.4");
          });

          describe("and the 2nd runner becomes a non-runner", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarketPrices(SMP_UPDATED_SECOND_RUNNER_IS_NONRUNNER_MOCK));
              await browser.tickFakeClock();
              await browser.waitUntilEquals(secondSbkHorseRacingRunnerNonRunnerPO.title, "Non Runner");
            });

            it("[PRPI-7334] The 2 previous odds for the non-runner should be hidden", async () => {
              expect(await secondSbkHorseRacingRunnerNonRunnerPO.title.getText()).toEqual("Non Runner");
              expect(await secondSbkHorseRacingRunnerPriceHistoryPO.value.isExisting()).toBe(false);
            });

            describe("and the race turns INPLAY", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getMarketPrices(SMP_TURNS_INPLAY_MOCK));
                await browser.tickFakeClock();
                await browser.waitUntilNotInDOM(firstSbkHorseRacingRunnerPriceHistoryPO.value);
              });

              it("[PRPI-7334] The 1st runner previous odds should not be visible", async () => {
                expect(await firstSbkHorseRacingRunnerPriceHistoryPO.value.isExisting()).toBe(false);
              });
            });
          });
        });
      });
    });
  });
});
