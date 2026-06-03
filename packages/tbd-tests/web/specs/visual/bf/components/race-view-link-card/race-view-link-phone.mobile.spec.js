const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const MODULE_NAME = "race_view_link_card";

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
                    countryFlag: null,
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

describe("When the user is at a given page and a swimlane is retrieved (with 3 RaceViewLinkCard cards)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_VIEW_MOCK.urn, {
        currentUrl: routes.getRacingViewUrl(),
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockFonts(getMockFonts());
    await browser.url(routes.getRacingViewUrl());
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4796]_should_render_race_view_link_card`);
  });

  it("[PRPI-4796]_should_render_race_view_link_card", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4796]_should_render_race_view_link_card`)).toBe(0);
  });
});
