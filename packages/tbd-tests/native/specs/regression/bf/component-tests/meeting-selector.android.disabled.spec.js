const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const {
  getRaceLayout,
  getCardResults,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const {
  GenericScreenSO,
  FilterDrawerSO,
  RadioListSO,
  SelectableItemsSO,
  SelectorSO,
  RaceTimeSO,
  RaceSwitcherCardSO,
} = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();
const genericScreenSO = new GenericScreenSO();
const raceMarketCardSO = new RaceMarketCardSO();
const raceSwitcherCardSO = new RaceSwitcherCardSO();
const selectableItemsSO = new SelectableItemsSO();
const raceTimeSO = new RaceTimeSO(selectableItemsSO.element);
const selectorSO = new SelectorSO();
const filterDrawerSO = new FilterDrawerSO();
const radioListSO = new RadioListSO(filterDrawerSO.element);

const MOCKED_IMAGE = `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`;

const RACE_ID = "30184830.1205";
const RACE_2_ID = "30174778.1630";

const sporstBookRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/16257108",
    name: "Photograph",
    selectionId: 16257108,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/29547685",
    name: "Dromiskin",
    selectionId: 29547685,
  },
];

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
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  url: "Not Implemented",
  edges: [
    {
      node: {
        __typename: "RaceMarketCard",
        numberOfRunners: 6,
        urn: `ppb:tbd:card:raceMarket:${RACE_ID};WIN|3`,
        raceViewLink: {
          viewUrn: `ppb:tbd:view:race:${RACE_ID}`,
          viewUrl: "",
        },
        title: "Win",
        race: {
          __typename: "Race",
          urn: `ppb:race:${RACE_ID}`,
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
                  urn: `ppb:race:${RACE_ID}`,
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
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.234263186",
              name: "1m2f Nov Stks",
              marketType: "WIN",
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: `ppb:race:${RACE_ID}`,
                  startTime: "2020-11-13T14:40:00",
                  name: "14:40 Aintree",
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
              runners: sporstBookRunners,
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.234263186/16257108" },
              { runnerURN: "ppb:sbkRunner:924.234263186/29547685" },
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
        urn: `ppb:tbd:card:raceMarket:${RACE_ID};WIN|3`,
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  url: `/horse-racing/chelmc-10th-dec/r-7%7C${RACE_ID}`,
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
        urn: `ppb:tbd:card:raceswitcher:${RACE_ID}`,
        race: {
          __typename: "Race",
          urn: `ppb:race:${RACE_ID}`,
          startTime: "2020-12-29T12:05:00.000Z",
          name: "Maiden Hurdle (Class 4) (Division I)",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184830",
            name: "29th Dec",
            country: "GB",
            countryFlag: {
              small: MOCKED_IMAGE,
            },
            venue: "Aintree",
            date: "2020-12-29T12:05:00.000Z",
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: `ppb:tbd:card:raceswitcher:${RACE_ID}`,
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: `ppb:tbd:card:raceViewLinks:7|${RACE_2_ID}`,
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK_WITH_SIBLINGS = {
  cards: [
    {
      __typename: "RaceSwitcherCard",
      urn: `ppb:tbd:card:raceswitcher:${RACE_ID}`,
      race: {
        __typename: "Race",
        urn: `ppb:race:${RACE_ID}`,
        startTime: "2020-12-29T12:05:00.000Z",
        name: "Maiden Hurdle (Class 4) (Division I)",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:30184830",
          name: "29th Dec",
          country: "GB",
          countryFlag: {
            small: MOCKED_IMAGE,
          },
          venue: "Aintree",
          date: "2020-12-29T12:05:00.000Z",
        },
      },
      siblingViews: {
        edges: [
          {
            node: {
              urn: "",
              race: {
                __typename: "Race",
                urn: `ppb:race:${RACE_ID}`,
                startTime: "2020-12-15T16:20:00.000Z",
                name: "Win Each Way",
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:30184830",
                  name: "Aintree. 29th Dec",
                  country: "FR",
                  countryFlag: null,
                  venue: "Aintree",
                  date: "2020-12-29T06:59:52.000Z",
                },
              },
              viewLink: {
                viewUrn: `ppb:tbd:view:race:7|${RACE_ID}`,
                viewUrl: `/horse-racing/amiens-15th-dec/r-7%7C${RACE_ID}`,
              },
            },
          },
          {
            node: {
              race: {
                __typename: "Race",
                urn: `ppb:race:${RACE_2_ID}`,
                startTime: "2020-12-10T14:00:00.000Z",
                name: "Handicap Hurdle (Class 3)",
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:30174778",
                  name: "Sedg 10th Dec",
                  country: "GB",
                  countryFlag: {
                    small: null,
                  },
                  venue: "Golden Gate Fields",
                  date: "2020-12-30T16:00:00.000Z",
                },
              },
              viewLink: {
                viewUrn: `ppb:tbd:view:race:${RACE_2_ID}`,
                viewUrl: `/horse-racing/chelmc-10th-dec/r-7%7C${RACE_2_ID}`,
              },
            },
          },
        ],
      },
    },
  ],
};

const BFF_RACE_VIEW_2_MOCK = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_2_ID}`,
  url: `/horse-racing/chelmc-10th-dec/r-7%7C${RACE_2_ID}`,
  race: {
    urn: `ppb:tbd:race:${RACE_2_ID}`,
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: `ppb:tbd:card:raceswitcher:${RACE_2_ID}`,
        race: {
          __typename: "Race",
          urn: `ppb:race:${RACE_2_ID}`,
          startTime: "2020-12-30T12:20:00.000Z",
          name: "Handicap Hurdle (Class 5)",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30174778",
            name: "Catt 30'th Dec",
            country: "GB",
            countryFlag: {
              small: MOCKED_IMAGE,
            },
            venue: "Golden Gate Fields",
            date: "2020-12-30T12:20:00.000Z",
          },
        },
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: `ppb:tbd:card:raceViewLinks:7|${RACE_2_ID}`,
        race: {
          __typename: "Race",
          urn: `ppb:race:${RACE_2_ID}`,
          startTime: "2020-12-30T12:20:00.000Z",
          name: "Handicap Hurdle (Class 5)",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30174778",
            name: "Catt 30'th Dec",
            country: "GB",
            countryFlag: {
              small: MOCKED_IMAGE,
            },
            venue: "Golden Gate Fields",
            date: "2020-12-30T12:20:00.000Z",
          },
        },
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30184863.1630",
              startTime: "2020-12-10T14:00:00.000Z",
              name: "Sedgefield",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30184863",
                name: "Sedg 10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
                },
                venue: "Sedgefield City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30184863.1630",
              viewUrl: `/horse-racing/chelmc-10th-dec/r-7%7C${RACE_2_ID}`,
            },
          },
          {
            race: {
              __typename: "Race",
              urn: `ppb:race:${RACE_2_ID}`,
              startTime: "2020-12-29T12:20:00.000Z",
              name: "Handicap Hurdle (Class 5)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "Catt 29th Dec",
                country: "GB",
                countryFlag: {
                  small: MOCKED_IMAGE,
                },
                venue: "Golden Gate Fields",
                date: "2020-12-29T12:20:00.000Z",
              },
            },
            viewLink: {
              viewUrn: `ppb:tbd:view:race:7|${RACE_2_ID}`,
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
        urn: `ppb:tbd:card:raceswitcher:${RACE_2_ID}`,
      },
    },
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: `ppb:tbd:card:raceViewLinks:7|${RACE_2_ID}`,
      },
    },
  ],
};

describe("Meeting Selector", () => {
  describe("When a raceSwitcherCard is retrieved with 3 meetings ordered as:Aintree\nSegdefield\nGolden Gate Fields", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_HR_PAGE_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_RACE_VIEW_MOCK_WITH_SIBLINGS));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(raceMarketCardSO.meetingInfo);
      await raceMarketCardSO.detailsContainer.click();

      // inside race homepage
      await browser.waitUntilDisplayed(raceSwitcherCardSO.element);
    });

    describe("And the user previously selected the 'Aintree' meeting", () => {
      it("[PRPI-4242] The meeting name visible on the meeting selector should be 'Aintree'", async () => {
        expect(await selectorSO.element.getText()).toBe("Aintree");
      });
      it("[PRPI-4243] The meeting date should be visible: 'Dec 29'", async () => {
        expect(await raceSwitcherCardSO.label.getText()).toBe("Dec 29");
      });
    });

    describe("When the user picks\n'Golden Gate Fields' meeting", () => {
      beforeAll(async () => {
        await selectorSO.element.click();
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_2_MOCK));

        await browser.waitUntilDisplayed(radioListSO.element);
        await radioListSO.item[1].click();
      });

      it("[PRPI-4244] The meeting name visible on the meeting selector should be 'Golden Gate Fields'", async () => {
        expect(await selectorSO.element.getText()).toBe("Golden Gate Fields");
      });
      it("[PRPI-4245] A new meeting date should be visible: 'Dec 30'", async () => {
        expect(await raceSwitcherCardSO.label.getText()).toBe("Dec 30");
      });
      it("[PRPI-4246] A new race selector with a total of 3 races should be visible on the page load", async () => {
        expect(await raceTimeSO.races.length).toBe(2);
      });
    });
  });
});
