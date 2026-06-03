const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService(browser);
const MODULE_NAME = "my_bets_page";

const BFF_MY_BETS_MOCK_FORBIDDEN_CARD = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  url: routes.getMyBetsViewUrl("open"),
  edges: [
    {
      node: {
        __typename: "ForbiddenContentCard",
        urn: "ppb:tbd:card:forbiddenContent:MyBets",
        forbiddenCardType: "MY_BETS",
      },
    },
  ],
  headerItems: HEADER_ITEMS_MOCK,
};

describe("My Bets Page", () => {
  describe("when the user opens the my bets page and is logged out", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MY_BETS_MOCK_FORBIDDEN_CARD.urn, { loggedIn: "false", products: ["sportsbook"] }),
      );
      await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_FORBIDDEN_CARD));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1430]_should_see_my_bets_page_with_the_forbidden_card_and_without_the_filters`,
      );
    });

    it("[PRPI-1430]_should_see_my_bets_page_with_the_forbidden_card_and_without_the_filters", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1430]_should_see_my_bets_page_with_the_forbidden_card_and_without_the_filters`,
        ),
      ).toBe(0);
    });
  });
});
