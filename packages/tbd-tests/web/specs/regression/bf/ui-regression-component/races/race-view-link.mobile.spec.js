const { SportPagePO, ScrollableSwimlanePO, SelectableItemsPO } = require("../../../../../page-objects");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getSportsLayout, getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceViewLinkCardPO = require("@ppb/tbd-shared/components/RaceViewLinkCard/RaceViewLinkCard.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPage = new SportPagePO();
const raceViewLinkSwimlanePO = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const raceViewLinkCardPO = new RaceViewLinkCardPO(raceViewLinkSwimlanePO.scrollItems[0]);
const selectableItems = new SelectableItemsPO();

const mockService = new MockService();

const BFF_VIEW_MOCK = {
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
                  urn: "ppb:race:30269293.1410",
                  meeting: {
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
                  viewUrl: routes.getRaceViewUrl("7", "30269293.1410"),
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
                    urn: "ppb:meeting:30267677",
                    name: "Dund 5th Feb",
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
                  urn: "ppb:race:30267658.1300",
                  meeting: {
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
  url: routes.getRaceViewUrl("7", "30269293.1410"),
  race: {
    urn: "ppb:tbd:race:7|30269293.1410",
    meeting: {
      urn: "30269293",
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
              viewUrl: "",
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
              viewUrl: "",
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

describe("RaceviewLinkCard", () => {
  describe("When the user is at a given page and a swimlane is retrieved (with 3 RaceViewLinkCard cards)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK.urn, {
          currentUrl: routes.getRacingViewUrl(),
        }),
      );
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntil(async () => (await raceViewLinkCardPO.venue.getText()) === "Southwell");
    });

    it("[PRPI-7450] The swimlane should be visible with a total of 3 cards on page load", async () => {
      expect(await raceViewLinkSwimlanePO.scrollItems.length).toBe(3);
    });

    it("[PRPI-7451] The first card should have the venue name visible: 'Southwell'", async () => {
      expect(await raceViewLinkCardPO.venue.getText()).toBe("Southwell");
    });

    it("[PRPI-7452] The first card should have the country flag visible", async () => {
      expect(await raceViewLinkCardPO.countryFlag.isDisplayed()).toBe(true);
    });

    describe("When the user taps the first swimlane card Southwell", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
        await raceViewLinkCardPO.element.click();
        await browser.waitUntilDisplayed(selectableItems.races[0]);
      });

      it("[PRPI-7453]The first race visible on the viewport should be: '14:10'", async () => {
        expect(await selectableItems.races[0].getText()).toEqual("14:10");
      });

      it("[PRPI-7454] The '14:10' race should have a selected state", async () => {
        expect(await selectableItems.activeRaceContent.getText()).toEqual("14:10");
      });
    });
  });
});
