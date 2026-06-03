const RaceViewLinkCardSO = require("@ppb/tbd-shared/components/RaceViewLinkCard/RaceViewLinkCard.native.so");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  getGenericLayout,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const {
  ScrollableSwimlaneSO,
  SelectableItemsSO,
  SelectorSO,
  GenericScreenSO,
  SportPageScreenSO,
  RaceTimeSO,
} = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const raceViewLinkSwimlaneSO = new ScrollableSwimlaneSO();
const sportSO = new SportPageScreenSO();
const raceViewLinkCardSO = new RaceViewLinkCardSO(sportSO.raceViewLinkCards[0]);
const selectableItemsSO = new SelectableItemsSO();
const raceTimeSO = new RaceTimeSO(selectableItemsSO.element);
const meetingSelectorSO = new SelectorSO();

const BFF_VIEW_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:sport:7",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X_w6nhAAACIAsuw_/s/7",
        cardGroupTitle: "Later Today",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30269293.1410",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30269293.1410",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30269293",
                    countryFlag: {
                      small: "http://example.test.com/mockedImage/image.png",
                      medium: "http://example.test.com/mockedImage/image.png",
                      large: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Southwell",
                  },
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:race:7|30269293.1410",
                  viewUrl: "horse-racing/south-5th-feb/r-7%7C30269293.1410",
                },
              },
            },
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30267677.1600",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30267677.1600",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30267677",
                    countryFlag: {
                      small: "http://example.test.com/mockedImage/image.png",
                      medium: "http://example.test.com/mockedImage/image.png",
                      large: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Dundalk",
                  },
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:race:7|30267677.1600",
                  viewUrl: "horse-racing/dund-5th-feb/r-7%7C30267677.1600",
                },
              },
            },
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30267658.1300",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30267658.1300",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30267658",
                    countryFlag: {
                      small: "http://example.test.com/mockedImage/image.png",
                      medium: "http://example.test.com/mockedImage/image.png",
                      large: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Catterick",
                  },
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:race:7|30267658.1300",
                  viewUrl: "horse-racing/catt-5th-feb/r-7%7C30267658.1300",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30269293.1410",
              },
            },
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30267677.1600",
              },
            },
            {
              node: {
                __typename: "RaceViewLinkCard",
                urn: "ppb:tbd:card:raceViewLink:7|30267658.1300",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X_w6nhAAACIAsuw_/s/7",
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30269293.1410",
  race: {
    urn: "ppb:race:30269293.1410",
    meeting: {
      urn: "30269293",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
        race: {
          __typename: "Race",
          urn: "ppb:race:30269293.1410",
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30185830",
            name: "Southwell. 5th Fev",
            countryFlag: null,
            venue: "Southwell",
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
          urn: "ppb:race:30174778.1634",
          startTime: "2020-02-05T14:10:00.000Z",
          runners: [],
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30174778",
            name: "Southwell 5th Fev",
            countryFlag: {
              vector: null,
            },
            venue: "Southwell",
          },
        },
        raceViewLinks: [
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1630",
              startTime: "2020-12-10T14:10:00.000Z",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "Southwell  5th Fev",
                countryFlag: {
                  vector: null,
                },
                venue: "Southwell",
              },
            },
            viewLink: {
              viewUrn: "",
            },
          },
          {
            race: {
              __typename: "Race",
              urn: "ppb:race:30174778.1631",
              startTime: "2020-02-05T14:20:00.000Z",
              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30174778",
                name: "Southwell  5th Fev",
                countryFlag: {
                  vector: null,
                },
                venue: "Southwell",
              },
            },
            viewLink: {
              viewUrn: "",
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

describe("RaceViewLinkCard", () => {
  describe("​​When the user is at a given screen and a swimlane is retrieved (with 3 RaceViewLinkCard cards)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_MOCK));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(raceViewLinkSwimlaneSO.flatlist);
    });

    it("[PRPI-2446] The swimlane should be visible with a total of 3 cards on page load", async () => {
      expect(await sportSO.raceViewLinkCards.length).toBe(3);
    });

    it("[PRPI-2447] The first card should have the venue name visible: 'Southwell'", async () => {
      expect(await raceViewLinkCardSO.venue.getText()).toBe("Southwell");
    });

    it("[PRPI-2448] The first card should have the country flag visible", async () => {
      expect(await raceViewLinkCardSO.countryFlag.isDisplayed()).toBe(true);
    });

    describe("When the user taps the first swimlane card 'Southwell'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
        await raceViewLinkCardSO.element.click();
        await browser.waitUntilDisplayed(raceTimeSO.races[0]);
      });

      it("[PRPI-2449] The meeting name should be visible on the meeting selector: 'Southwell'", async () => {
        expect(await meetingSelectorSO.element.getText()).toEqual("Southwell");
      });

      it("[PRPI-2450] The first race visible on the viewport should be: '14:10'", async () => {
        expect(await raceTimeSO.races[0].getText()).toEqual("14:10");
      });
    });
  });
});
