const {
  getAppContext,
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { MyBetsScreenSO, MyBetsHeaderSO, TabsGroupSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO();
const tabsSO = new TabsGroupSO();

const NO_BETS_MOCK = [];

const VIEW_NO_BETS_MOCK = getMyBetsEXCViewMock(NO_BETS_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const HOME_VIEW_LINK = getStartViewLink(routes.getMyBetsViewUrl("open"));

describe("My Bets Page - No Bets", () => {
  describe("when a logged-in user opens the my bets page with no bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_NO_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(myBetsSO.element, "My Bets not displayed");
      await browser.waitUntilDisplayed(myBetsSO.emptyState, "My Bets Empty State not displayed");
    });

    it("[PRPI-1845] should show the page title", async () => {
      expect(await myBetsHeaderSO.title.getText()).toBe("My Bets");
    });

    it("[PRPI-1846] should show the 'Open/Settled' filter", async () => {
      expect(await tabsSO.element.isDisplayed()).toBe(true);
      expect(await tabsSO.tabsTitles[0].getText()).toBe("Open");
      expect(await tabsSO.tabsTitles[1].getText()).toBe("Settled");
    });

    it("[PRPI-1847] should display the no bets state", async () => {
      expect(await myBetsSO.emptyState.isDisplayed()).toBe(true);
    });
  });
});
