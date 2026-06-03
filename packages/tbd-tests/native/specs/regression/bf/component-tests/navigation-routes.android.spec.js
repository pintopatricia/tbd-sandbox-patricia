const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const {
  getSportsLayout,
  getMarketLayout,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { StatusLabelSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");
const { CardSO, SelectableItemsSO, RaceTimeSO } = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
const statusLabelSO = new StatusLabelSO();
const cardSO = new CardSO();
const selectableItemsSO = new SelectableItemsSO();
const raceTimeSO = new RaceTimeSO(selectableItemsSO.element);

const MARKET_ID = "1.171344945";

const SMP_MOCK = {
  markets: [
    {
      marketId: "1",
      runnerDetails: [],
    },
  ],
};

const sportsbookRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/16257108",
    name: "Photograph",
    selectionId: 16257108,
  },
];

const MEETING_MOCK = {
  __typename: "Meeting",
  urn: "ppb:meeting:29901908",
  name: "Wind 13th Jul",
  country: "GB",
  countryFlag: {
    small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
  },
  venue: "Aintree",
};

const RACE_MOCK = {
  __typename: "Race",
  urn: "ppb:race:30061949.1335",
  startTime: "2020-11-13T14:40:00",
  name: "14:40 Aintree",
  details: {
    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
    going: "GOOD_FIRM",
    status: "GOING_DOWN",
    numberOfRunners: 14,
  },
  meeting: MEETING_MOCK,
};

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
        race: RACE_MOCK,
        raceViewLink: {
          viewUrn: "ppb:tbd:view:race:7|30061949.1335",
          viewUrl: "",
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.234263186",
              name: "1m2f Nov Stks",
              marketType: "WIN",
              hierarchy: {
                __typename: "RaceHierarchy",
                race: RACE_MOCK,
                meeting: MEETING_MOCK,
              },
              runners: sportsbookRunners,
            },
            runners: sportsbookRunners,
          },
        },
        numberOfRunnersToDisplay: 3,
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

const BFF_MARKET_VIEW_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:1.171782025/24000991/0",
        race: {
          details: {
            going: "Good to firm in places",
            status: "GOING_DOWN",
          },
          meeting: MEETING_MOCK,
        },
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:7|30061949.1335`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30184830.1205",
  race: RACE_MOCK,
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
        race: RACE_MOCK,
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
        race: {
          __typename: "Race",
          urn: "ppb:race:30174778.1630",
          startTime: "2020-12-10T14:10:00.000Z",
          name: "Sedgefield",
          details: null,
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184830",
            name: "Sedge 10th Dec",
            country: "GB",
            countryFlag: {
              small: null,
            },
            venue: "Sedgefield City",
            date: "2020-12-10T14:10:00.000Z",
          },
        },
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1205",
              startTime: "2020-12-15T14:00:00.000Z",
              name: "Win Each Way",
              details: null,
              runners: null,
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30185830",
                name: "Aintree. 29th Dec",
                country: "FR",
                countryFlag: null,
                venue: "Aintree",
                date: "2020-12-14T06:59:52.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1205",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1205",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1630",
              startTime: "2020-12-15T14:10:00.000Z",
              name: "Win Each Way",
              details: null,
              runners: null,
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "Aintree. 29th Dec",
                country: "FR",
                countryFlag: null,
                venue: "Aintree",
                date: "2020-12-14T06:59:52.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1630",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30174778.1630",
            },
          },
        ],
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.170259755;924.2288261550",
        cardTitle: "Win",
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:${MARKET_ID}`,
            viewUrl: `/horse-racing/here-13th-oct/3m1f-hcap-hrd/r-${MARKET_ID}`,
          },
        ],

        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.170259755",
            },
            runners: [{ runnerURN: "runnerUrn" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.170259755;924.2288261550",
      },
    },
  ],
};

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: "1.160337355",
      selections: [],
    },
  ],
};

const ERO_MOCK = [
  {
    runners: [],
  },
];

describe("Navigation Routes", () => {
  describe("When user is in a view with horse racing swimlane and taps on the market title", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getWallets([{ amount: "5.00", walletName: "MAIN" }]));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));

      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(cardSO.title, "Win");
      await browser.waitUntilClickableNative(cardSO.title);
      await cardSO.title.click();
      await browser.waitUntilDisplayed(raceTimeSO.races[1]);
    });

    it("[PRPI-2340] The RaceView should be displayed", async () => {
      expect(await raceTimeSO.races.length).toBe(2);
    });

    describe("when user clicks on market name", () => {
      beforeAll(async () => {
        // market view
        await browser.waitUntilEquals(cardSO.title, "Win");
        await browser.waitUntilClickableNative(cardSO.title);
        await cardSO.title.click();
        await browser.waitUntilEquals(statusLabelSO.text, "Going Down");
      });

      it("[PRPI-2341] The MarketView should be displayed", async () => {
        expect(await statusLabelSO.text.getText()).toBe("Going Down");
      });
    });
  });
});
