const { MyBetsPagePO } = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");

const MockService = require("../../helpers/mocking-service");
const routes = require("../../../utils/routes");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const NO_BETS_MOCK = [];

const VIEW_NO_BETS_MOCK = getMyBetsEXCViewMock(NO_BETS_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - No Bets", () => {
  describe("when a logged-in user opens the my bets page with no bets", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_NO_BETS_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_NO_BETS_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(myBetsPO.emptyState, "My Bets Empty State not displayed");

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1424]_should_display_the_no_bets_state`);
    });

    it("[PRPI-1424]_should_display_the_no_bets_state", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1424]_should_display_the_no_bets_state`)).toBe(0);
    });
  });
});
