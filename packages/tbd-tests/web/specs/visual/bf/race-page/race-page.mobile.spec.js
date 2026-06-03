const {
  SelectableItemsPO,
  HorseRacingRunnerPO,
  CardPO,
  RunnerDetailsPO,
  SportsbookMarketPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const MarketPO = require("@ppb/tbd-shared/components/Market/Market.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const selectableItemsPO = new SelectableItemsPO();

const firstRacePO = selectableItemsPO.races[0];
const secondRacePO = selectableItemsPO.races[1];

const marketPO = new MarketPO();
const marketCardPO = new CardPO(marketPO.element);
const sportsbookMarketPO = new SportsbookMarketPO(marketCardPO.sportsbookMarket);
const firstHorseRacingRunnerSportsbookPO = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[0]);
const firstSbkRunnerDetailsPO = new RunnerDetailsPO(firstHorseRacingRunnerSportsbookPO.element);

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const MODULE_NAME = "race_view";
const MOCKED_IMAGE = "http://example.test.com/mockedImage/image.png";
const RACE_ID = "123.45";

const getRaceRunners = (raceId) => [
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/16257108`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 10,
    },
    form: "1-9696",
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/29547685`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 9,
    },
    form: "1-9696",
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/26374771`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 666,
    },
    form: "1-9696",
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/16257101`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 10,
    },
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/29547681`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 9,
    },
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/26374772`,
    raceURN: `ppb:race:${raceId}`,
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
      silk: MOCKED_IMAGE,
      draw: 666,
    },
  },
];

const race = {
  __typename: "Race",
  urn: "ppb:race:30061949.1335",
  name: "14:40 Aintree",
  runners: getRaceRunners("30061949.1335"),
  meeting: {
    __typename: "Meeting",
    urn: "ppb:meeting:29901908",
    venue: "Aintree",
    countryFlag: {
      vector: MOCKED_IMAGE,
      small: MOCKED_IMAGE,
      medium: MOCKED_IMAGE,
      large: MOCKED_IMAGE,
    },
  },
};

const BFF_VIEW_MOCK = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  race: {
    __typename: "Race",
    urn: "ppb:race:30177518.1720",
    meeting: {
      urn: "ppb:meeting:30177518",
    },
  },
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
  canonicalUrl: "/exchange/plus/horse-racing/market/1.176595463",
  edges: [
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
        race: {
          __typename: "Race",
          urn: "ppb:race:30174778.1634",
          startTime: "2020-12-10T14:40:00.000Z",
          name: "Nursery (Class 4)",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30174778",
            name: "ChelmC  10th Dec",
            country: "GB",
            countryFlag: {
              vector: MOCKED_IMAGE,
              small: MOCKED_IMAGE,
              medium: MOCKED_IMAGE,
              large: MOCKED_IMAGE,
            },
            venue: "Chelmsford City",
            date: "2020-12-10T14:00:00.000Z",
          },
        },
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1630",
              startTime: "2020-12-10T14:00:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1630",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1631",
              startTime: "2020-12-10T14:10:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1631",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1632",
              startTime: "2020-12-10T14:20:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1632",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1633",
              startTime: "2020-12-10T14:30:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            marketPromo: {
              signposting: "MONEY_BACK",
            },
            blurbs: [],
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1633",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1634",
              startTime: "2020-12-10T14:40:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1634",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1635",
              startTime: "2020-12-10T14:50:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1635",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1636",
              startTime: "2020-12-10T15:00:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  vector: MOCKED_IMAGE,
                  small: MOCKED_IMAGE,
                  medium: MOCKED_IMAGE,
                  large: MOCKED_IMAGE,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1636",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
        ],
      },
    },
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        numberOfRunners: 3,
        race: {
          __typename: "Race",
          urn: "ppb:race:29901908.1410",
          startTime: "2020-07-13T14:40:00Z",
          name: "Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 4, furlongs: 4, yards: 19 },
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            type: "FLAT",
          },
          runners: getRaceRunners("29901908.1410"),
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            name: "Wind 13th Jul",
            country: "GB",
            countryFlag: {
              vector: MOCKED_IMAGE,
              small: MOCKED_IMAGE,
              medium: MOCKED_IMAGE,
              large: MOCKED_IMAGE,
            },
            venue: "Aintree",
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:30061949.1335;WIN|3",
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
              vector: MOCKED_IMAGE,
              small: MOCKED_IMAGE,
              medium: MOCKED_IMAGE,
              large: MOCKED_IMAGE,
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
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
      },
    },
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:30061949.1335;WIN|3",
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

describe("When I navigate to Race Page And BBF is retrieving 6 runners for that race with runner details", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getRaceLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getRaceViewUrl("7", RACE_ID));
  });

  describe("When scroll horizontally on race selector to the middle of the list", () => {
    beforeAll(async () => {
      await secondRacePO.scrollIntoView({ block: "end" });
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1528]_should_display_gradient_masks_on_both_sides_of_list`,
      );
    });

    it("[PRPI-1528]_should_display_gradient_masks_on_both_sides_of_list", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1528]_should_display_gradient_masks_on_both_sides_of_list`),
      ).toEqual(0);
    });

    describe("When scroll horizontally to the beginning of the list", () => {
      beforeAll(async () => {
        await firstRacePO.scrollIntoView({ block: "end" });
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1529]_should_display_gradient_masks_on_right_side_of_list`,
        );
      });

      it("[PRPI-1529]_should_display_gradient_masks_on_right_side_of_list", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1529]_should_display_gradient_masks_on_right_side_of_list`),
        ).toEqual(0);
      });
    });
  });

  describe("When the first runner is clicked", () => {
    beforeAll(async () => {
      await firstHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].waitForClickable();
      await firstHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].click();
      await browser.waitUntilDisplayed(firstSbkRunnerDetailsPO.age);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1530]_should_display_runner_expanded_details`);
    });
    it("[PRPI-1530]_should_display_runner_expanded_details", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1530]_should_display_runner_expanded_details`)).toEqual(0);
    });
  });
});
