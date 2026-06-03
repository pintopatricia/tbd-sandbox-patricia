const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { TabsGroupSO } = require("../../../../../screen-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");

const tabsSO = new TabsGroupSO();
const secondTabSO = new TabsGroupSO(tabsSO.tabButtons[1]);

const mockService = new MockService();

const MODULE_NAME = "navigation-tab-sizes";
const ID = "999";

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:TabsListSizes",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:bigSizeTab",
            tabTitle: {
              translate: null,
              translated: "XXL - BIG SIZE TAB",
              __typename: "TranslatableText",
            },
            full: {
              edges: [],
            },
            partials: {
              partialEdges: [],
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:extraSmallTab",
            tabTitle: {
              translate: null,
              translated: "XS",
              __typename: "TranslatableText",
            },
            full: {
              edges: [],
            },
            partials: {
              partialEdges: [],
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:bigSizeTab",
            tabTitle: {
              translate: null,
              translated: "XXL - EXTRA EXTRA BIG SIZE TAB",
              __typename: "TranslatableText",
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:extraSmallTab",
            tabTitle: {
              translate: null,
              translated: "XS",
              __typename: "TranslatableText",
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: "ppb:tbd:card:navigationTabsList:TabsListSizes",
    __typename: "NavigationTabsList",
  },
};

const BFF_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:generic:home`,
  url: `view/d-${ID}`,
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

describe("Navigation Tabs List - Different Tab Sizes", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await startApp("home");

    await browser.waitUntilDisplayed(secondTabSO.element);
    await browser.waitUntilClickableNative(secondTabSO.element);
    await secondTabSO.element.click();

    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-4926]_should_show_selected_tab_with_few_characters_with_correct_layout`,
    );
  });

  it("[PRPI-4926]_should_show_selected_tab_with_few_characters_with_correct_layout", async () => {
    expect(
      (
        await browser.compareScreen(
          `${MODULE_NAME}_[PRPI-4926]_should_show_selected_tab_with_few_characters_with_correct_layout`,
        )
      ).misMatchPercentage,
    ).toEqual(0);
  });
});
