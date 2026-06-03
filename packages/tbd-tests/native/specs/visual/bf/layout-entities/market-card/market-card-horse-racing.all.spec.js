const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { startApp } = require("../../../../../helpers/urls");
const { HorseRacingRunnerSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const MODULE_NAME = "market_card";
const firstHorseRacingRunnerSportsbookSO = new HorseRacingRunnerSO();

const raceRunners = [
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
      pastPerformances: [
        {
          race: {
            details: {
              scheduledTime: "2021-04-23T00:00:00Z",
              distance: {
                miles: 0,
                furlongs: 4,
                yards: 220,
              },
              numberOfRunners: 13,
              going: "GOOD_SOFT",
              type: "FLAT",
            },
            venue: null,
            raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
          },
          positionOfficial: 2,
          performanceComment: "This is a performance comment",
        },
        {
          race: {
            details: {
              scheduledTime: "2021-01-07T00:00:00Z",
              distance: {
                miles: 0,
                furlongs: 5,
                yards: 220,
              },
              numberOfRunners: 10,
              going: null,
              type: "FLAT",
            },
            venue: "DOOMBEN",
            raceUrl: "https://videoplayer.betfair.com/GetPlayer.do?tr=266&tID=1.38.1211027.5",
          },
          positionOfficial: 2,
        },
        {
          race: {
            details: {
              scheduledTime: "2020-12-04T00:00:00Z",
              distance: {
                miles: 0,
                furlongs: 5,
                yards: 110,
              },
              numberOfRunners: 8,
              going: null,
              type: "FLAT",
            },
            venue: "MUDGEE",
          },
          positionOfficial: 3,
        },
        {
          race: {
            details: {
              scheduledTime: "2020-12-14T00:00:00Z",
              distance: {
                miles: 0,
                furlongs: 6,
                yards: 134,
              },
              numberOfRunners: 8,
              going: null,
              type: "FLAT",
            },
            venue: "MUDGEE",
          },
          positionOfficial: 4,
        },
        {
          race: {
            details: {
              scheduledTime: "2020-12-14T00:00:00Z",
              distance: {
                miles: 0,
                furlongs: 2,
                yards: 116,
              },
              numberOfRunners: 5,
              going: null,
              type: "FLAT",
            },
            venue: "MUDGEE",
          },
          positionOfficial: 2,
        },
      ],
    },
    details: {
      jockeyName: "John Velazquez",
      trainerName: "Richard Hannon",
      saddleCloth: 4,
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 10,
    },
    form: "1-9696",
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
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 9,
    },
    form: "1-9696",
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
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 666,
    },
    form: "1-9696",
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
      silk: "http://example.test.com/mockedImage/image.png",
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
      silk: "http://example.test.com/mockedImage/image.png",
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
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 666,
    },
  },
];

const race = {
  __typename: "Race",
  urn: "ppb:race:29901908.1410",
  name: "14:40 Aintree",
  runners: raceRunners,
  meeting: {
    __typename: "Meeting",
    urn: "ppb:meeting:29901908",
    venue: "Aintree",
    countryFlag: {
      vector: "http://example.test.com/mockedImage/image.png",
      small: "http://example.test.com/mockedImage/image.png",
      medium: "http://example.test.com/mockedImage/image.png",
      large: "http://example.test.com/mockedImage/image.png",
    },
  },
};

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:29901908.1410;WIN|3",
        cardTitle: "Win",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.234263186",
              name: "1m2f Nov Stks",
              marketType: "WIN",
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:7",
                name: "HR",
                sportId: 7,
              },
              hierarchy: {
                __typename: "RaceHierarchy",
                race,
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/16257108",
                  name: "Shakalakaboomboom",
                  selectionId: 16257108,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/29547685",
                  name: "John Snow Snowing Snowing Snowing",
                  selectionId: 29547685,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/26374771",
                  name: "Shakalala",
                  selectionId: 26374771,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/16257101",
                  name: "Shakalakaboomboom",
                  selectionId: 16257101,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/29547681",
                  name: "John Snow Snowing Snowing Snowing",
                  selectionId: 29547681,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.234263186/26374772",
                  name: "Shakalala",
                  selectionId: 26374772,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.234263186/16257108" },
              { runnerURN: "ppb:sbkRunner:924.234263186/29547685" },
              { runnerURN: "ppb:sbkRunner:924.234263186/26374771" },
            ],
          },
        },
        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Aintree",
            countryFlag: {
              vector: "http://example.test.com/mockedImage/image.png",
              small: "http://example.test.com/mockedImage/image.png",
              medium: "http://example.test.com/mockedImage/image.png",
              large: "http://example.test.com/mockedImage/image.png",
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
        isRunnerExpandable: true,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:29901908.1410;WIN|3",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.234263186",
      status: "OPEN",
      guaranteedPriceAvailable: true,
      eachwayAvailable: true,
      numberOfPlaces: 3,
      placeFraction: {
        numerator: 1,
        denominator: 5,
      },
      runnerDetails: [
        {
          selectionId: "16257108",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
          ],
        },
        {
          selectionId: "29547685",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
          ],
        },
        {
          selectionId: "26374771",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
          ],
        },
        {
          selectionId: "16257101",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "29547681",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "26374772",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};
describe("Layout Entity - Market Card", () => {
  describe("When the user is on a HR sports page And BFF is retrieving 1 marketCard with all the needed info from SCA", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await startApp("home", { pullToRefresh: true });
      await browser.waitUntilDisplayed(firstHorseRacingRunnerSportsbookSO.element);
    });

    describe("And the user taps the first runner chevron", () => {
      beforeAll(async () => {
        await firstHorseRacingRunnerSportsbookSO.element.click();
        await browser.waitUntilDisplayed(firstHorseRacingRunnerSportsbookSO.expandableDetails);
      });

      it("[PRPI-4944]_should_see_runner_info", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4944]_should_see_runner_info`)).misMatchPercentage,
        ).toEqual(0);
      });
    });
  });
});
