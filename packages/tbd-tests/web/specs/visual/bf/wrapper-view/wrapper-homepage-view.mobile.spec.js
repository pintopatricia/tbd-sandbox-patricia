const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const BFF_MOCK = {
  url: "",
  urn: "ppb:tbd:view:generic:home",
  __typename: "GenericView",
  viewHeader: {
    title: null,
    titleImage: null,
    subTitle: null,
    badge: null,
  },
  edges: [],
  partialEdges: [
    {
      node: {
        __typename: "SportRibbonCardGroup",
        urn: "ppb:tbd:cardgroup:sportRibbon:1",
      },
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:swimlane:YhO78BAAAB4AB7-r/cv/home",
        __typename: "SwimlaneCardGroup",
      },
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:quicklinksGrid:Z0ci7xEAACIA7fuE/cv/home",
        __typename: "QuicklinksGridCardGroup",
      },
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:quicklinksGrid:ZkSNtBEAACMAbKHU/cv/home",
        __typename: "QuicklinksGridCardGroup",
      },
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:quicklinksGrid:Yvz_AhAAACAAFRIN/cv/home",
        __typename: "QuicklinksGridCardGroup",
      },
    },
    {
      node: {
        urn: "ppb:tbd:cardgroup:swimlane:YwDJxhAAACIAJd81/cv/home",
        __typename: "SwimlaneCardGroup",
      },
    },
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        __typename: "GamingPrizeMachineCard",
      },
    },
  ],
};

const BFF_CARDS = {
  cards: [],
};

const MODULE_NAME = "wrapper";

describe("When the user opens the homepage in a wrapper and no cards have been loaded yet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        clientContext: {
          platform: "android",
          uiVariant: "mobile",
          wrapper: {
            wrapperName: "GamingWrapper",
            bridgeAPIVersion: "1.0.0",
          },
          webWrappedExperience: true,
        },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest({
      ...getCardResults(BFF_CARDS, {
        statusCode: 404,
      }),
      delay: 10000,
    });
    await browser.url(routes.getHomeViewUrl());
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1592]_Wrapper_homepage_core_view_is_displayed`);
  });

  it("[PRPI-1592]_Wrapper_homepage_core_view_is_displayed", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1592]_Wrapper_homepage_core_view_is_displayed`)).toBe(0);
  });
});
