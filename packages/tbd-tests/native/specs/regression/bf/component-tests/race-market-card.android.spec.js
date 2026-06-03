const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  getSportsLayout,
  getBettingCardDisplayRunners,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  RunnerSO,
  ExchangeBetButtonSO,
  ExchangeMarketSO,
  StatusLabelSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const genericScreenSO = new GenericScreenSO();
const raceMarketCardSO = new RaceMarketCardSO();
const exchangeMarketSO = new ExchangeMarketSO();
const raceDetailsSO = new RaceDetailsSO();
const statusLabelSO = new StatusLabelSO();

const BFF_VIEW_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  url: "Not Implemented",
  edges: [
    {
      node: {
        __typename: "RaceMarketCard",
        numberOfRunners: 6,
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
        title: "Win",
        race: {
          __typename: "Race",
          urn: "ppb:race:30061949.1335",
          startTime: "2020-11-13T14:40:00",
          name: "14:40 Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "GOOD_FIRM",
            status: "GOING_BEHIND",
            numberOfRunners: 14,
          },
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
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-11-13T14:40:00",
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
                },
              ],
            },
            runners: [{ runnerURN: "ppb:excRunner:1.171344945/16257108/0" }],
          },
        },
        runnerViewLinks: [
          {
            runnerUrn: "ppb:excRunner:1.171344945/16257108/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.171344945/16257108/0",
          },
        ],

        raceViewLink: {
          viewUrl: "horse-racing/here-13th-oct/r-7|30061949.1335",
          viewUrn: "ppb:tbd:view:race:7|30061949.1335",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
      },
    },
  ],
};

const marketCardUpdateMock = {
  cards: [
    {
      __typename: "RaceMarketCard",
      urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
      displayRunners: {
        exchange: {
          runners: [{ runnerURN: "ppb:excRunner:1.171344945/28633350/0" }],
        },
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: "1.171344945",
    state: {
      inplay: true,
    },
    runners: [
      {
        selectionId: "16257108",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],
  },
];

const SCA_RACES_MOCK = {
  race: [
    {
      id: "30061949.1335",
      details: {
        status: "OFF",
      },
    },
  ],
};

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
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0|false",
      },
    },
  ],
};

describe("Race Market Card", () => {
  describe("When the user is on a given view and a racemarketcard is retrieved with 6 HR runners", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(raceMarketCardSO.meetingFlag);
    });

    it("[PRPI-2440] The racemarketcard should be rendered with the title: '14:40 Aintree' and a country flag", async () => {
      expect(await raceMarketCardSO.meetingTime.getText()).toBe("14:40");
      expect(await raceMarketCardSO.meetingName.getText()).toBe("Aintree");
      expect(await raceMarketCardSO.meetingFlag.isDisplayed()).toBe(true);
    });

    it("[PRPI-2441] The race status should be shown 'Going Behind'", async () => {
      expect(await statusLabelSO.text.getText()).toBe("Going Behind");
    });

    it("[PRPI-2442] The total of runners visible at page load should be 3", async () => {
      expect(await raceMarketCardSO.runners.length).toBe(1);
    });
  });

  describe("And the next request is automatically triggered And a new StatusLabel 'Off' is retrieved", () => {
    const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
    const firstExchangeBetButtonSO = new ExchangeBetButtonSO(firstExchangeRunnerSO.betButtons[0]);

    beforeAll(async () => {
      await mockService.mockHttpRequest(getBettingCardDisplayRunners(marketCardUpdateMock));
      await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await browser.waitUntil(async () => (await statusLabelSO.text.getText()) === "Off");
    });

    it("[PRPI-2443] The race status should be updated to 'Off'", async () => {
      expect(await statusLabelSO.text.getText()).toBe("Off");
    });

    it("[PRPI-2444] The first runner back odd should be '1.1'", async () => {
      expect(await firstExchangeBetButtonSO.odd.getText()).toContain("1.1");
    });

    describe("When the user taps on the first runner", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
        await browser.waitUntilDisplayed(firstExchangeRunnerSO.element);
        await firstExchangeRunnerSO.element.click();
        await browser.waitUntilDisplayed(raceDetailsSO.element);
      });

      it("[PRPI-2445] The race screen should open", async () => {
        expect(await raceDetailsSO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
