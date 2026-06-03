const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const {
  getSportsLayout,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { StatusLabelSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { SelectableItemsSO, RaceTimeSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
const raceMarketCardSO = new RaceMarketCardSO();
const statusLabelSO = new StatusLabelSO();
const selectableItemsSO = new SelectableItemsSO();
const selectedRaceSO = new RaceTimeSO(selectableItemsSO.element);
const fifthRaceTimeSO = new RaceTimeSO(selectableItemsSO.races[4]);

const MOCKED_IMAGE = "http://example.test.com/mockedImage/image.png";

const RACE_ID = "30184830.1205";
const RACE_2_ID = "30184863.1220";

const exchangeRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/16257108/0",
    name: "Shakalakaboomboom",
    selectionId: 16257108,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/29547685/0",
    name: "Dromiskin",
    selectionId: 29547685,
  },
];

const BFF_HR_PAGE_MOCK = {
  __typename: "SportView",
  urn: `ppb:tbd:view:sport:7`,
  url: "Not Implemented",
  sport: {
    __typename: "Sport",
    urn: `ppb:eventType:7`,
    sportId: 7,
    name: "Horse Racing",
  },
  edges: [
    {
      node: {
        __typename: "RaceMarketCard",
        numberOfRunners: 6,
        urn: "ppb:tbd:card:raceMarket:30184830.1205;WIN|3",
        raceViewLink: {
          viewUrn: "ppb:tbd:view:race:30184830.1205",
          viewUrl: "",
        },
        title: "Win",
        race: {
          __typename: "Race",
          urn: "ppb:race:30184830.1205",
          startTime: "2020-11-13T14:40:00",
          name: "14:40 Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            numberOfRunners: 14,
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184830",
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
                  urn: "ppb:race:30184830.1205",
                  startTime: "2020-11-13T14:40:00",
                  name: "14:40 Aintree",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30184830",
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
                  urn: "ppb:meeting:30184830",
                  name: "Wind 13th Jul",
                  country: "GB",
                  countryFlag: {
                    small: "http://example.test.com/mockedImage/image.png",
                  },
                  venue: "Aintree",
                },
              },
              runners: exchangeRunners,
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:30184830.1205;WIN|3",
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30184830.1205",
  race: {
    urn: `ppb:tbd:race:${RACE_ID}`,
    meeting: {
      urn: "30184830",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
        race: {
          __typename: "Race",
          urn: "ppb:race:30184830.1205",
          startTime: "2020-12-29T14:00:00",
          name: "Maiden Hurdle (Class 4) (Division I)",
          details: null,
          runners: null,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184830",
            name: "29th Dec",
            country: "GB",
            countryFlag: {
              small: MOCKED_IMAGE,
            },
            venue: "Aintree",
            date: "2020-12-29T12:05:00",
          },
        },
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
        race: {
          __typename: "Race",
          urn: "ppb:race:30174778.1630",
          startTime: "2020-12-10T14:10:00",
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
            date: "2020-12-10T14:10:00",
          },
        },
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1205",
              startTime: "2020-12-15T14:00:00",
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
                date: "2020-12-14T06:59:52",
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
              startTime: "2020-12-15T14:10:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1630",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30174778.1630",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1420",
              startTime: "2020-12-15T14:20:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1420",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1420",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1430",
              startTime: "2020-12-15T14:30:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1430",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1430",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1410",
              startTime: "2020-12-10T14:40:00",
              details: {
                resultType: "QUICK_RESULT",
              },
              name: "Sedgefield",
              runners: [],
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30184830",
                name: "Sedg 10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
                },
                venue: "Sedgefield City",
                date: "2020-12-10T16:00:00",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1410",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30184830.1410",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184863.1220",
              startTime: "2020-12-29T15:10:00",
              name: "Handicap Hurdle (Class 5)",
              details: null,
              runners: null,
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30184863",
                name: "Catt 29th Dec",
                country: "GB",
                countryFlag: {
                  small: MOCKED_IMAGE,
                },
                venue: "Golden Gate Fields Woodbine Greyville Gaton Valparaiso",
                date: "2020-12-29T12:20:00",
              },
            },
            marketPromo: {
              signposting: "MONEY_BACK",
            },
            blurbs: [],
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184863.1220",
              viewUrl: "horse-racing/catt-15th-dec/r-7%7C30184863.1220",
            },
          },
        ],
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
  ],
};

const BFF_RACE_VIEW_MOCK_2 = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:7|${RACE_2_ID}`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30184863.1220",
  race: {
    urn: `ppb:tbd:race:${RACE_2_ID}`,
    meeting: {
      urn: "30184863",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184863.1220",
        race: {
          __typename: "Race",
          urn: "ppb:race:30184863.1220",
          startTime: "2020-12-29T15:10:00",
          name: "Maiden Hurdle (Class 4) (Division I)",
          details: null,
          runners: null,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184863",
            name: "29th Dec",
            country: "GB",
            countryFlag: {
              small: MOCKED_IMAGE,
            },
            venue: "Aintree",
            date: "2020-12-29T12:05:00",
          },
        },
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30184863.1220",
        race: {
          __typename: "Race",
          urn: "ppb:race:30184863.1220",
          startTime: "2020-12-10T15:10:00",
          name: "Sedgefield",
          details: null,
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184863",
            name: "Sedge 10th Dec",
            country: "GB",
            countryFlag: {
              small: null,
            },
            venue: "Sedgefield City",
            date: "2020-12-10T15:10:00",
          },
        },
        marketPromo: {
          signposting: "MONEY_BACK",
        },
        blurbs: [],
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1205",
              startTime: "2020-12-15T14:00:00",
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
                date: "2020-12-14T06:59:52",
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
              urn: "ppb:race:30184830.1410",
              startTime: "2020-12-15T14:10:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1410",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1410",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1420",
              startTime: "2020-12-15T14:20:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1420",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1420",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1430",
              startTime: "2020-12-15T14:30:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1430",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1430",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1630",
              startTime: "2020-12-10T14:40:00",
              name: "Sedgefield",
              details: null,
              runners: [],
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "Sedg 10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
                },
                venue: "Sedgefield City",
                date: "2020-12-10T16:00:00",
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
              urn: "ppb:race:30184830.1450",
              startTime: "2020-12-15T14:50:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1450",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1450",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184830.1500",
              startTime: "2020-12-15T15:00:00",
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
                date: "2020-12-14T06:59:52",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184830.1500",
              viewUrl: "horse-racing/amiens-15th-dec/r-7%7C30184830.1500",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184863.1220",
              startTime: "2020-12-29T15:10:00",
              name: "Handicap Hurdle (Class 5)",
              details: null,
              runners: null,
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30184863",
                name: "Catt 29th Dec",
                country: "GB",
                countryFlag: {
                  small: MOCKED_IMAGE,
                },
                venue: "Golden Gate Fields Woodbine Greyville Gaton Valparaiso",
                date: "2020-12-29T12:20:00",
              },
            },
            marketPromo: {
              signposting: "MONEY_BACK",
            },
            blurbs: [],
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184863.1220",
              viewUrl: "horse-racing/catt-15th-dec/r-7%7C30184863.1220",
            },
          },
        ],
      },
    },
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
            status: "GOING_DOWN",
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
              runners: exchangeRunners,
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
              { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184863.1220",
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30184863.1220",
      },
    },
    {
      node: {
        __typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
      },
    },
  ],
};

describe("RaceSelector", () => {
  describe("When a raceviewLinksCard is retrieved with 6 races ordered as: 14:00\n14:10\n14:20\n14:30\n14:40\n15:10\n", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await mockService.mockHttpRequest(getSportsLayout(BFF_HR_PAGE_MOCK));

      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      // inside race homepage
      await browser.waitUntilClickableNative(raceMarketCardSO.detailsContainer);
      await raceMarketCardSO.detailsContainer.click();
      // inside race homepage
      await browser.waitUntilEquals(selectedRaceSO.selectedRace, "14:10");
    });

    describe("And the user previously selected the '14:10' race And the race '14:40' has results", () => {
      it("[PRPI-4250] The first start time visible on the viewport should be '14:10' and should have a selected state", async () => {
        expect(await selectedRaceSO.selectedRace.getText()).toBe("14:10");
      });

      it("[PRPI-4251] The race selector should be visible with a total of 8 races on page load", async () => {
        expect(await selectableItemsSO.races.length).toBe(6);
      });
    });

    it("[PRPI-4252] The '14:40' start time should have a lollipop visible", async () => {
      expect(await fifthRaceTimeSO.raceTimeText.getText()).toBe("14:40");
      expect(await fifthRaceTimeSO.iconContainer.isDisplayed()).toBe(true);
    });

    describe("When the user scrolls till the last race '15:10' and tap it And that race has associated promos", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK_2));
        await selectableItemsSO.races[5].click();
        await browser.waitUntilEquals(selectedRaceSO.selectedRace, "15:10");
      });

      it("[PRPI-4253] The 15:10 start time should become visible and selected", async () => {
        expect(await selectedRaceSO.selectedRace.getText()).toBe("15:10");
      });

      it("[PRPI-4254] The 15:10 race should have money back icon visible", async () => {
        expect(await selectedRaceSO.promoIconContainer.isDisplayed()).toBe(true);
      });

      it("[PRPI-4255] A new racedetailscard should be rendered with race status: 'Going Down'", async () => {
        expect(await statusLabelSO.text.getText()).toBe("Going Down");
      });
    });
  });
});
