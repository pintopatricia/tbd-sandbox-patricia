const { SingleTabPO } = require("../../../../page-objects");
const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "wrapper";
const mockService = new MockService();
const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = new SingleTabPO(navigationTabsListPO.tabs[0]);
const NUMBER_OF_TABS = 15;

const createNavigationTabPartial = (id) => ({
  node: {
    __typename: "NavigationTab",
    urn: `ppb:tbd:view:navigationTab:${id}`,
    tabTitle: {
      translated: `Tab ${id}`,
    },
  },
});

const createNavigationTab = (id) => ({
  __typename: "NavigationTab",
  urn: `ppb:tbd:view:navigationTab:${id}`,
  tabTitle: {
    translate: {
      key: "I18N.DATE.MONDAY",
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "QuickLinksCard",
          urn: `ppb:tbd:card:quickLinks:${id}`,
          links: [
            {
              label: `Random Link ${id}`,
              viewLink: {
                viewUrn: `ppb:tbd:view:market:924.${id}`,
                viewUrl: `market/924.${id}`,
              },
            },
          ],
        },
      },
    ],
  },
  partials: {
    partialEdges: [
      {
        node: {
          __typename: "QuickLinksCard",
          urn: `ppb:tbd:card:quickLinks:${id}`,
        },
      },
    ],
  },
});

const createNavigationTabsList = (id) => ({
  node: {
    __typename: "NavigationTabsList",
    urn: `ppb:tbd:card:navigationTabsList:${id}`,
    tabsTitle: "Navigation Tabs",
    full: {
      edges: [{ node: createNavigationTab(1) }],
    },
    partials: {
      edges: [...Array(NUMBER_OF_TABS).keys()].map((key) => createNavigationTabPartial(key + 1)),
    },
  },
});

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [createNavigationTabsList(1)],
  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:navigationTabsList:1",
        __typename: "NavigationTabsList",
      },
    },
  ],
};

describe("Wrapper view with tabs", () => {
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
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns wrapper view", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstTabPO.element);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1594]_should_correctly_display_wrapper_view_with_navigation_tabs`,
      );
    });

    it("[PRPI-1594]_should_correctly_display_wrapper_view_with_navigation_tabs", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1594]_should_correctly_display_wrapper_view_with_navigation_tabs`,
        ),
      ).toBe(0);
    });
  });
});
