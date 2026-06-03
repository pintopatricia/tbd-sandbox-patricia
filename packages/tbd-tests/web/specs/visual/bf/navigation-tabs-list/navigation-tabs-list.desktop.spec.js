const { SingleTabPO, ScrollableTabsPO } = require("../../../../page-objects");
const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "navigation_tabs_list";
const mockService = new MockService();
const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = new SingleTabPO(navigationTabsListPO.tabs[0]);
const scrollableTabsPO = new ScrollableTabsPO();
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

const BFF_LAST_TAB_MOCK = { cards: [createNavigationTab(15)] };

describe("Navigation Tabs List", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns navigation tabs", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstTabPO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1414]_should_correctly_display_navigation_tabs`);
    });

    it("[PRPI-1414]_should_correctly_display_navigation_tabs", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1414]_should_correctly_display_navigation_tabs`)).toBe(0);
    });
  });

  describe("when a tab is hovered", () => {
    beforeAll(async () => {
      await firstTabPO.element.moveTo();
      await browser.waitUntilDisplayed(scrollableTabsPO.rightButton);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1415]_should_display_right_arrow`);
    });

    it("[PRPI-1415]_should_display_right_arrow", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1415]_should_display_right_arrow`)).toBe(0);
    });
  });

  describe("when a the right arrow is clicked", () => {
    beforeAll(async () => {
      await scrollableTabsPO.rightButton.waitForClickable();
      await scrollableTabsPO.rightButton.click();
      await browser.waitUntilDisplayed(scrollableTabsPO.leftButton);
      await browser.waitUntilNotDisplayed(scrollableTabsPO.rightButton);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1416]_should_hide_right_arrow_and_show_left`);
    });

    it("[PRPI-1416]_should_hide_right_arrow_and_show_left", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1416]_should_hide_right_arrow_and_show_left`)).toBe(0);
    });
  });

  describe("when the user selects the last tab", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_LAST_TAB_MOCK));

      const tabsLength = await navigationTabsListPO.tabs.length;
      const lastTabPO = new SingleTabPO(navigationTabsListPO.tabs[tabsLength - 1]);

      await lastTabPO.element.waitForClickable();
      await lastTabPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1417]_should_see_the_last_tab_content`);
    });

    it("[PRPI-1417]_should_see_the_last_tab_content", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1417]_should_see_the_last_tab_content`)).toBe(0);
    });
  });
});
