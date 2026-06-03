const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { startApp } = require("../../../../helpers/urls");
const MockService = require("../../../../mock-essentials/mocking-service");
const { MyBetsScreenSO, BottomBarSO, TabsGroupSO, SportsbookBetPanelSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsScreenSO = new MyBetsScreenSO();
const tabsSO = new TabsGroupSO();
const firstTabSO = new TabsGroupSO(tabsSO.tabButtons[0]);
const secondTabSO = new TabsGroupSO(tabsSO.tabButtons[1]);
const sbkBetPanelSO = new SportsbookBetPanelSO(myBetsScreenSO.betCardGroups[0]);

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

          footballFixture: {
            homeName: "Home",
            awayName: "Away",
            scheduledAt: "2024-07-05T18:30:00.000Z",
          },
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

          footballFixture: {
            homeName: "PiverLool",
            awayName: "Unschester Manited",
            scheduledAt: "2024-07-02T18:31:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037075/0002961",
        placedDate: "2023-04-01T09:45:41.000Z",
      },
    },
  },
]);

const CARD_NAME = "my_bets_page";
describe("My Bets Page - SBK PriceBoost", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({ products: ["sportsbook"] }));
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_OPEN_MOCK));
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_BET_SETTLED_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await startApp("home");
    await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
    await BottomBarSO.myBets.click();
    await browser.waitUntilDisplayed(myBetsScreenSO.header, "My bets screen title is not displayed");
  });

  describe("Bet is yet not settled", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstTabSO.element, "open tab not showing");
      await browser.waitUntilClickableNative(firstTabSO.element, "open tab not clickable");
      await browser.waitUntilDisplayed(sbkBetPanelSO.element);
    });
    it("[PRPI-4850]_the_sbk_bet_card_group_should_be_displayed_with_pbm_signpost", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4850]_the_sbk_bet_card_group_should_be_displayed_with_pbm_signpost`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
  describe("Bet is settled", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(secondTabSO.element, "settled tab not showing");
      await browser.waitUntilClickableNative(secondTabSO.element, "settled tab not clickable");
      await secondTabSO.element.click();
      await browser.waitUntilDisplayed(sbkBetPanelSO.element);
      await browser.waitUntilImageEquals(
        `${CARD_NAME}_[PRPI-4851]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost`,
      );
    });
    it("[PRPI-4851]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost", async () => {
      expect(
        (
          await browser.compareScreen(
            `${CARD_NAME}_[PRPI-4851]_the_sbk_settled_bet_card_group_should_be_displayed_with_pbm_signpost`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
