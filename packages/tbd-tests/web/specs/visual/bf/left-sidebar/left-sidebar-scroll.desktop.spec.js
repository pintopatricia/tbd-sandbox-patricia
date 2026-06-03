const { getGenericLayout, getQueryCardResponseByOperation } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const LeftSidebarPO = require("@ppb/tbd-shared/components/LeftSidebar/LeftSidebar.web.po");
const QuickLinksCardPO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.web.po");
const { QuicklinksGridPO, QuickLinkPO } = require("../../../../page-objects");

const {
  getFullLeftSideBarMock,
  getPopularQuicklinksGridCardGroup,
} = require("../../../../mock-essentials/left-sidebar-mock-helper");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "left_sidebar_scroll";
const mockService = new MockService();
const leftSidebar = new LeftSidebarPO();
const firstQuicklinkCardGroup = new QuicklinksGridPO(leftSidebar.quicklinksCardGroups[0]);
const thirdQuicklinkCardGroup = new QuickLinksCardPO(leftSidebar.quicklinksCardGroups[2]);

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  leftSidebar: getFullLeftSideBarMock(),
  edges: [],
  partialEdges: [],
};

describe("Left Sidebar - Scroll", () => {
  describe("When BFF returns left side bar", () => {
    beforeAll(async () => {
      const url = getHomeViewUrl();

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
      await mockService.mockHttpRequest(
        getQueryCardResponseByOperation("QuicklinksGridCardGroup", getPopularQuicklinksGridCardGroup()),
      );
      await mockService.mockHttpRequest(getSSCHeaderCSS());
      await mockService.mockHttpRequest(getSSCv1Content());
      await mockService.mockFonts(getMockFonts());

      await browser.url(url);
      await browser.waitUntilDisplayed(leftSidebar.element);
      await browser.waitUntilDisplayed(firstQuicklinkCardGroup.element);

      const promotionQuickLink = new QuickLinkPO(firstQuicklinkCardGroup.rows[1]);
      await browser.waitUntilDisplayed(promotionQuickLink.element);
      await browser.waitUntilDisplayed(promotionQuickLink.title);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1385]_should_render_left_sidebar`);
    });

    it("[PRPI-1385]_should_render_left_sidebar", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1385]_should_render_left_sidebar`)).toEqual(0);
    });
  });

  describe("When there is a scroll, left side bar should scroll", () => {
    beforeAll(async () => {
      const secondQuickLink = new QuickLinkPO(firstQuicklinkCardGroup.rows[1]);
      await browser.waitUntilDisplayed(secondQuickLink.title);

      const thirdQuicklinkCardGroupQuicklinksLength = await thirdQuicklinkCardGroup.quicklinks.length;
      const lastQuickLink = new QuickLinkPO(
        thirdQuicklinkCardGroup.quicklinks[thirdQuicklinkCardGroupQuicklinksLength - 1],
      );
      await lastQuickLink.element.scrollIntoView();
      await browser.waitUntilDisplayed(lastQuickLink.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1386]_should_scroll_left_sidebar`);
    });

    it("[PRPI-1386]_should_scroll_left_sidebar", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1386]_should_scroll_left_sidebar`)).toEqual(0);
    });
  });
});
