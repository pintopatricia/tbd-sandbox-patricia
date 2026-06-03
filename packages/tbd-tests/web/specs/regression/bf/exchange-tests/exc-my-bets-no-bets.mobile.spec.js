const { MyBetsPagePO, MyBetsHeaderPO, TabsGroupPO } = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const tabsPO = new TabsGroupPO();

const NO_BETS_MOCK = [];

const VIEW_NO_BETS_MOCK = getMyBetsEXCViewMock(NO_BETS_MOCK, {
  isOpen: true,
  hasFooter: true,
});

describe("My Bets Page - No Bets", () => {
  describe("when a logged-in user opens the my bets page with no bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_NO_BETS_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_NO_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(myBetsPO.emptyState, "My Bets Empty State not displayed");
    });

    it("[PRPI-5554] should show the page title", async () => {
      expect(await myBetsHeaderPO.header.getText()).toBe("My Bets");
    });

    it("[PRPI-5555] should show the 'Open/Settled' filter", async () => {
      expect(await tabsPO.element.isDisplayed()).toBe(true);
      expect(await tabsPO.tabs[0].getText()).toBe("Open");
      expect(await tabsPO.tabs[1].getText()).toBe("Settled");
    });

    it("[PRPI-4456] should display the no bets state", async () => {
      expect(await myBetsPO.emptyState.isDisplayed()).toBe(true);
    });
  });
});
