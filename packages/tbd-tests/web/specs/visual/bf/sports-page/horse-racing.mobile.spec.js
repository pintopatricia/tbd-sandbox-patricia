const { SportPagePO, ScrollableSwimlanePO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstPrimarySwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const secondRaceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[1]);

const mockService = new MockService();
const MODULE_NAME = "horse_racing";
const EVENT_TYPE_ID = 7;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
                title: "Win",
                numberOfRunners: 14,
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/16257108/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/16257108/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/29547685/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/29547685/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/26374771/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/26374771/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/28633350/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/28633350/0",
                  },
                ],

                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.171344945",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
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
                              small: "http://example.test.com/mockedImage/image.png",
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
                            small: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Aintree",
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
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1410",
                  startTime: "2020-07-13T14:40:00Z",
                  name: "14:40 Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1410/16257108/0",
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
                        bred: "IRE",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: "4",
                        draw: 10,
                        silk: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:29901908.1410/29547685/0",
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
                      urn: "ppb:tbd:racerunner:29901908.1410/26374771/0",
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
                        bred: "IRE",
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
                      small: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Aintree",
                  },
                },
                numberOfRunnersToDisplay: 3,
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 9,
                urn: "ppb:tbd:card:raceMarket:1111111111",
                title: "Win",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.2222222222",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:2222222222",
                          startTime: "2020-07-13T14:50:00Z",
                          name: "Aintree",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:2222222222",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: null,
                            venue: "Aintree",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:2222222222",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: null,
                          venue: "Aintree",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/2222222222/0",
                          name: "Shakalakaboom",
                          selectionId: 2222222222,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/3333333/0",
                          name: "Back From Dubai",
                          selectionId: 3333333,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/4444444/0",
                          name: "Back From Dubai",
                          selectionId: 4444444,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.2222222222/2222222222/0" },
                      { runnerURN: "ppb:excRunner:1.2222222222/3333333/0" },
                      { runnerURN: "ppb:excRunner:1.2222222222/4444444/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:2222222222",
                  startTime: "2020-07-13T14:50:00Z",
                  name: "Aintree",
                  details: {
                    type: "FLAT",
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 5 },
                    numberOfRunners: 9,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/2222222222/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 2222222222,
                      horse: {
                        name: "Shakalakaboomboom",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                        bred: "IRE",
                      },
                      details: {
                        saddleCloth: "666",
                        silk: null,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/3333333/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 3333333,
                      horse: {
                        name: "BACK FROM DUBAI (IRE)",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                        bred: "IRE",
                      },
                      details: {
                        saddleCloth: "999",
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/4444444/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 4444444,
                      horse: {
                        name: "BACK FROM DUBAI (IRE)",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                        bred: "IRE",
                      },
                      details: {
                        saddleCloth: "999",
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:2222222222",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: null,
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
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1111111111",
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

const BFF_VIEW_MOCK_FACET_ONLY = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
                title: "Win",
                numberOfRunners: 6,
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/16257108/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/16257108/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/29547685/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/29547685/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/26374771/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/26374771/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.171344945/28633350/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.171344945/28633350/0",
                  },
                  {
                    runnerUrn: "ppb:sbkRunner:924.234263186/16257108",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:924.234263186/16257108/0",
                  },
                ],

                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.171344945",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:29901908.1410",
                          startTime: "2020-07-13T14:50:00Z",
                          name: "Aintree",
                          details: null,
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            name: "Wind 13th Jul",
                            country: "GB",
                            venue: "Aintree",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          name: "Wind 13th Jul",
                          country: "GB",
                          venue: "Aintree",
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
                          runnerURN: "ppb:excRunner:1.171344945/12804940/0",
                          name: "Top Garry",
                          selectionId: 12804940,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                      { runnerURN: "ppb:excRunner:1.171344945/12804940/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:29901908.1410",
                  startTime: "2020-07-13T14:50:00Z",
                  name: "Aintree",
                  details: null,
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    name: "Wind 13th Jul",
                    country: "GB",
                    venue: "Aintree",
                  },
                },
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 9,
                urn: "ppb:tbd:card:raceMarket:1111111111",
                title: "Win",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.2222222222",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:2222222222",
                          startTime: "2020-07-13T14:50:00Z",
                          name: "Aintree",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:2222222222",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: null,
                            venue: "Aintree",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:2222222222",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: null,
                          venue: "Aintree",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/2222222222/0",
                          name: "Shakalakaboom",
                          selectionId: 2222222222,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/3333333/0",
                          name: "Back From Dubai",
                          selectionId: 3333333,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.2222222222/4444444/0",
                          name: "Back From Dubai",
                          selectionId: 4444444,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.2222222222/2222222222/0" },
                      { runnerURN: "ppb:excRunner:1.2222222222/3333333/0" },
                      { runnerURN: "ppb:excRunner:1.2222222222/4444444/0" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:2222222222",
                  startTime: "2020-07-13T14:50:00Z",
                  name: "Aintree",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 5 },
                    numberOfRunners: 9,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/2222222222/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 2222222222,
                      horse: {
                        name: "Shakalakaboomboom",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                        bred: "IRE",
                      },
                      details: {
                        saddleCloth: "666",
                        silk: null,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/3333333/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 3333333,
                      horse: {
                        name: "BACK FROM DUBAI (IRE)",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                        bred: "IRE",
                      },
                      details: {
                        jockeyName: "John Velazquez Figuerote",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: "999",
                        draw: 666,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:2222222222/4444444/0",
                      raceURN: "ppb:race:2222222222",
                      selectionId: 4444444,
                      horse: {
                        name: "BACK FROM DUBAI (IRE)",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                        bred: "IRE",
                      },
                      details: {
                        jockeyName: "John Velazquez Figuerote",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: "999",
                        draw: 666,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:2222222222",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: null,
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
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1111111111",
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
      {
        selectionId: "12804940",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
        state: {
          adjustmentFactor: 2.0,
          sortPriority: 11,
          removalDate: "2021-05-13T14:40:00Z",
          status: "REMOVED",
        },
      },
    ],
  },
  {
    marketId: "1.2222222222",
    runners: [
      {
        selectionId: "2222222222",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "3333333",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "4444444",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],
  },
];

const ERO_MOCK_SUSPENDED_MARKET = [
  {
    state: { status: "SUSPENDED" },
    ...ERO_MOCK[0],
  },
];

describe("Horse Racing page", () => {
  //And BFF is retrieving 1 swimlane named "Next Races" with 7 racing market cards (4 full) and without race details for the 1st card (NULL)
  //And BFF is only retrieving meeting, race and runner (1st) mandatory fields for the third racing market card
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getRacingViewUrl());
    await firstPrimarySwimlanePO.scrollItems[1].scrollIntoView({ block: "center" });
    await browser.waitUntilDisplayed(secondRaceMarketCardPO.element);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4787]_should_display_with_mandatory_info`);
  });

  it("[PRPI-4787]_should_display_with_mandatory_info", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4787]_should_display_with_mandatory_info`)).toEqual(0);
  });
});

describe("Horse Racing page", () => {
  //And BFF is retrieving 1 swimlane named "Next Races" with 2 racing market cards
  //and without SCA meeting, race and runner details for the 1st card
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK_FACET_ONLY.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK_SUSPENDED_MARKET));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK_FACET_ONLY));
    await browser.url(routes.getRacingViewUrl());

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4788]_should_display_next_races_with_only_facet_info`);
  });

  it("[PRPI-4788]_should_display_next_races_with_only_facet_info", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-4788]_should_display_next_races_with_only_facet_info`),
    ).toEqual(0);
  });
});
