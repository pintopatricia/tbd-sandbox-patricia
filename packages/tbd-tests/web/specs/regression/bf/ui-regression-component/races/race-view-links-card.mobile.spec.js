const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { SelectableItemsPO, RaceTimePO } = require("../../../../../page-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

const selectableItems = new SelectableItemsPO();

const raceTimePO = new RaceTimePO(selectableItems.races[4]);

const RACE_ID = "123.45";

const BFF_VIEW_MOCK_FIRST_SELECT = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
  race: {
    urn: `ppb:tbd:race:${RACE_ID}`,
    meeting: {
      urn: "123",
    },
  },
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
              small: null,
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
              details: {
                resultType: "QUICK_RESULT",
              },
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
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
                  small: null,
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
                  small: null,
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
                  small: null,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
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
              details: {
                resultType: "FULL_RESULT",
              },
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
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
                  small: null,
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
                  small: null,
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
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1637",
              startTime: "2020-12-10T15:10:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1637",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
        ],
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
  ],
};

const BFF_VIEW_MOCK_SECOND_SELECT = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:7|30174778.1637`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1637",
  race: {
    urn: "ppb:tbd:race:7|30174778.1637",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1637",
        race: {
          __typename: "Race",
          urn: "ppb:race:30174778.1637",
          startTime: "2020-12-10T15:10:00.000Z",
          name: "Nursery (Class 4)",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30174778",
            name: "ChelmC  10th Dec",
            country: "GB",
            countryFlag: {
              small: null,
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
                  small: null,
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
                  small: null,
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
                  small: null,
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
                  small: null,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
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
                  small: null,
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
                  small: null,
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
                  small: null,
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
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1637",
              startTime: "2020-12-10T15:10:00.000Z",
              name: "Nursery (Class 4)",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "ChelmC  10th Dec",
                country: "GB",
                countryFlag: {
                  small: null,
                },
                venue: "Chelmsford City",
                date: "2020-12-10T16:00:00.000Z",
              },
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:race:7|30174778.1637",
              viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1637",
      },
    },
  ],
};

describe("When the user is on '14:40 Aintree' race card page, And the 14:40 race has results", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK_FIRST_SELECT.urn));
    await mockService.mockHttpRequest(getRaceLayout(BFF_VIEW_MOCK_FIRST_SELECT));
    await mockService.mockHttpRequest(getRaceLayout(BFF_VIEW_MOCK_SECOND_SELECT));
    await browser.url(routes.getRaceViewUrl("7", RACE_ID));

    await browser.waitUntilDisplayed(selectableItems.activeRaceContent);
  });

  it("[PRPI-7455] The '14:40' start time should have a selected state", async () => {
    expect(await selectableItems.activeRaceContent.getText()).toEqual("14:40");
  });

  it("[PRPI-7456] The '14:40' start time should have a lollipop visible", async () => {
    expect(await raceTimePO.iconContainer.isDisplayed()).toBe(true);
  });

  it("[PRPI-7457] The race selector should be visible with a total of 8 races on page load", async () => {
    expect(await selectableItems.races.length).toEqual(8);
  });

  describe("When the user scrolls till the last race '15:10' and tap it", () => {
    beforeAll(async () => {
      await selectableItems.races[7].scrollIntoView();
      await selectableItems.races[7].click();

      await browser.waitUntilDisplayed(selectableItems.activeRaceContent);
    });

    it("[PRPI-7458] The 15:10 start time should become visible and selected A new racedetailscard should be rendered: '15:10 Aintree'", async () => {
      expect(await selectableItems.activeRaceContent.getText()).toEqual("15:10");
      expect(await selectableItems.races[7].isDisplayedInViewport()).toBe(true);
    });
  });
});
