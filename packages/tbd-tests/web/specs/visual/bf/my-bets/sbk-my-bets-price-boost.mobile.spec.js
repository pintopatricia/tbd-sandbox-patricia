const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { MyBetsPagePO, SportsbookBetPanelPO, StatusLabelPO } = require("../../../../page-objects");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const routes = require("../../../../../utils/routes");

const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const statusLabel = new StatusLabelPO(sbkBetPanelPO.statusLabel);
const MODULE_NAME = "my_bets_sbk";

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_BET_OPEN_MOCK = getMyBetsSBKViewMock([
  {
    isOpen: true,
    isPBM: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    result: "VOID",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Home",
            awayName: "Away",
            scheduledAt: "2024-07-05T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 1,
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Home vs Away",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Home",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037074/0002962",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const SBK_BET_SETTLED_MOCK = getMyBetsSBKViewMock([
  {
    betId: "12345678",
    isOpen: false,
    isSettled: true,
    isPBM: true,
    result: "WON",
    profitAndLoss: 3.123,
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "PiverLool",
            awayName: "Unschester Manited",
            scheduledAt: "2024-07-02T18:31:00.000Z",
          },
          legs: [
            {
              legNumber: 1,
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(3),
                  originalPrice: buildPrice(3),
                  eventDescription: "PiverLool vs Unschester Manited",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Home",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037075/0002961",
        placedDate: "2023-04-01T09:45:41.000Z",
      },
    },
  },
]);

const browseToMyBets = async (BFF_MOCK, url) => {
  await mockService.mockFonts(getMockFonts());

  await mockService.mockHttpRequest(
    await getIndexHTML(BFF_MOCK.urn, {
      products: ["sportsbook"],
      MY_BETS_WIN_LOSE_VOID: { isActive: false },
      date: "2024-06-18T09:45:00.000Z",
    }),
  );
  await mockService.mockHttpRequest(getMyBetsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl(url));
  await browser.waitUntilInViewport(sbkBetPanelPO.element);
};

describe("My Bets Page - SBK PriceBoost", () => {
  describe("When the user has a Price Boosted Multiple Bet in an open state", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_BET_OPEN_MOCK, "open");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1464]_the_sbk_bet_card_group_should_be_displayed_with_pbm_signpost`,
      );
    });

    it("[PRPI-1464]_the_sbk_bet_card_group_should_be_displayed_with_pbm_signpost", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1464]_the_sbk_bet_card_group_should_be_displayed_with_pbm_signpost`,
        ),
      ).toBe(0);
    });
  });
  describe("When the user has a Price Boosted Multiple Bet in an settled state", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_BET_SETTLED_MOCK, "settled");
      await browser.waitUntilEquals(statusLabel.text, "Won");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1465]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost`,
      );
    });

    it("[PRPI-1465]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1465]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost`,
        ),
      ).toBe(0);
    });
  });
});
