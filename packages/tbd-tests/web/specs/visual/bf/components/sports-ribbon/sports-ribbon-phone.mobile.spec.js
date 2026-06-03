const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const MODULE_NAME = "sports-ribbon";

const BOTTOM_BAR_PROPERTY = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/myBets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [
    {
      node: {
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:123",
        full: {
          edges: [
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:inplay",
                genericViewLinkTitle: {
                  __typename: "DisplayNameTitle",
                  name: "In-Play",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:generic:inplay",
                  viewUrl: "view/d-inplay",
                },
                badge: "INPLAY",
              },
            },
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:gaming",
                genericViewLinkTitle: {
                  __typename: "DisplayNameTitle",
                  name: "Casino",
                },
                viewLink: {
                  viewUrn: "ppb:tbd:view:gaming:1",
                  viewUrl: "casino/gm-1",
                },
                badge: "CASINO",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:1",
                viewLink: {
                  viewUrl: "football/sport:1",
                  viewUrn: "ppb:tbd:view:sport:1",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:1",
                  name: "Football",
                  sportId: 1,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:12",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:12",
                  viewUrl: "football/sport:12",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:12",
                  name: "Rowing",
                  sportId: 12,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:11",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:11",
                  viewUrl: "football/sport:11",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:11",
                  name: "Cycling",
                  sportId: 11,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:4339",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:4339",
                  viewUrl: "football/s-4339",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:4339",
                  name: "Greyhound Racing",
                  shortName: "Greyhounds",
                  sportId: 4339,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7511",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:7511",
                  viewUrl: "football/s-511",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7511",
                  name: "Baseball",
                  sportId: 7511,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:6423",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:6423",
                  viewUrl: "football/s-6423",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:6423",
                  name: "American Football",
                  sportId: 6423,
                },
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:2593174",
                viewLink: {
                  viewUrn: "ppb:tbd:view:sport:2593174",
                  viewUrl: "football/s-2593174",
                },
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:2593174",
                  name: "Table Tennis",
                  sportId: 2593174,
                },
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:inplay",
              },
            },
            {
              node: {
                __typename: "GenericViewLinkCard",
                urn: "ppb:tbd:card:genericViewLink:gaming",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:1",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:12",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:11",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:4339",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:7511",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:6423",
              },
            },
            {
              node: {
                __typename: "SportViewLinkCard",
                urn: "ppb:tbd:card:sportViewLink:2593174",
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
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:123",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

describe("Sports Ribbon", () => {
  describe("When the user enters homepage with Sports Ribbon Swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1619]_the_sports_ribbon_swimlane_should_be_displayed_with_favourite_sports_available`,
      );
    });

    it("[PRPI-1619]_the_sports_ribbon_swimlane_should_be_displayed_with_favourite_sports_available", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1619]_the_sports_ribbon_swimlane_should_be_displayed_with_favourite_sports_available`,
        ),
      ).toBe(0);
    });
  });
});
