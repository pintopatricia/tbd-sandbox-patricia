const LeftSidebarPO = require("@ppb/tbd-shared/components/LeftSidebar/LeftSidebar.web.po");

const { QuicklinksGridPO, SearchBarPO } = require("../../../../page-objects");
const {
  getGenericLayout,
  getSearchResults,
  getQueryCardResponseByOperation,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getPopularQuicklinksGridCardGroup } = require("../../../../mock-essentials/left-sidebar-mock-helper");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "left_sidebar_search";
const mockService = new MockService();
const leftSidebarPO = new LeftSidebarPO();
const searchBarPO = new SearchBarPO();
const leftSidebar = new LeftSidebarPO();
const firstQuicklinkCardGroup = new QuicklinksGridPO(leftSidebar.quicklinksCardGroups[0]);

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  leftSidebar: {
    items: {
      edges: [
        {
          node: getPopularQuicklinksGridCardGroup(),
        },
      ],

      pageInfo: null,
    },
  },
  edges: [],
  partialEdges: [],
};

function getCompetitionSearchResult(competitionId) {
  return {
    __typename: "CompetitionView",
    urn: `ppb:tbd:view:competition:${competitionId}`,
    competition: {
      name: "Desktop League",
      urn: `ppb:competition:${competitionId}`,
      sport: {
        name: "Football",
      },
      logo: {
        large: "http://example.test.com/mockedImage/image.png",
      },
    },
  };
}

function getEventSearchResult(eventId) {
  return {
    __typename: "EventView",
    urn: `ppb:tbd:view:event:${eventId}`,
    sportevent: {
      name: `Home ${eventId} v Away ${eventId}`,
      openDate: `2089-10-10T${10 + eventId}:00Z`,
      competition: {
        name: `Desktop League${eventId > 3 ? " 2" : ""}`,
      },
    },
  };
}

const SEARCH_MOCK_5_RESULTS = [
  getCompetitionSearchResult(1),
  getEventSearchResult(2),
  getEventSearchResult(3),
  getEventSearchResult(4),
  getCompetitionSearchResult(5),
];

const SEARCH_MOCK_12_RESULTS = [...Array(12).keys()].map((index) => getEventSearchResult(index + 1));

describe("Left Sidebar - Search", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(
      getQueryCardResponseByOperation("QuicklinksGridCardGroup", getPopularQuicklinksGridCardGroup()),
    );
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());

    await browser.url(getHomeViewUrl());

    await browser.waitUntilDisplayed(leftSidebarPO.element);
  });

  describe("When there are no results for the search term", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSearchResults({ query: "desktop", results: [] }));

      await searchBarPO.input.setValue("desktop");
      await browser.tickFakeClock();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1387]_should_render_no_results_found`);
    });

    it("[PRPI-1387]_should_render_no_results_found", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1387]_should_render_no_results_found`)).toEqual(0);
    });
  });

  describe("when there are only 5 results", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSearchResults({ query: "desktop", results: SEARCH_MOCK_5_RESULTS }));

      await searchBarPO.cleanButton.click();
      await searchBarPO.input.setValue("desktop");
      await browser.tickFakeClock();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1388]_should_render_the_5_results`);
    });

    it("[PRPI-1388]_should_render_the_5_results", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1388]_should_render_the_5_results`)).toEqual(0);
    });
  });

  describe("when there are 12 results (currrent max)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSearchResults({ query: "desktop", results: SEARCH_MOCK_12_RESULTS }));

      await searchBarPO.cleanButton.click();
      await searchBarPO.input.setValue("desktop");
      await browser.tickFakeClock();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1389]_should_render_12_results_and_run_out_of_space`);
    });

    it("[PRPI-1389]_should_render_12_results_and_run_out_of_space", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1389]_should_render_12_results_and_run_out_of_space`),
      ).toEqual(0);
    });
  });

  describe("and the user scrolls to the last result", () => {
    beforeAll(async () => {
      await firstQuicklinkCardGroup.element.scrollIntoView();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1390]_should_scroll_and_render_rest_of_results`);
    });

    it("[PRPI-1390]_should_scroll_and_render_rest_of_results", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1390]_should_scroll_and_render_rest_of_results`)).toEqual(
        0,
      );
    });
  });
});
