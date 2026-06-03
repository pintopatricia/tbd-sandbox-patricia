const { getAppContext } = require("@ppb/tbd-shared/mocks/app-context/app-context.controller");
const {
  getMyBetsLayout,
  getHomeLayoutWithViewLink,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const SBK_SINGLE_90_MIN_MARKET = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    currentSize: 10,
    bonus: 0,
    profitAndLoss: 19.09,
    originalPotentialWin: null,
    isOpen: false,
    isSettled: true,
    isOddsBoosted: false,
    isSGM: false,
    isSGMMulti: false,
    has90MinBet: true,
    result: "WON",
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              result: "WON",
              parts: [
                {
                  price: {
                    decimal: 1.9,
                    fractional: {},
                  },
                  eventDescription: "Spezia v Entella",
                  eventMarketDescription: "Match Odds 90",
                  marketType: "MATCH_ODDS_90",
                  selectionName: "Spezia",
                  startTime: "2023-06-16T11:00:00.000Z",
                  handicap: null,
                  eachwayPlaces: null,
                  eachwayFactor: null,
                  rule4Deductions: 0,
                },
              ],
            },
          ],

          eventHeader: {
            title: "Spezia v Entella",
            tertiaryTitle: "Match Odds 90",
            date: "2023-06-16T11:00:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
        settledDate: "2023-06-15T12:48:03.000Z",
      },
    },
  },
]);

const CARD_NAME = "my_bets_page";

describe("My Bets Page - Settled", () => {
  describe("when the user opens My Bets page and has one single bet on 90-minute market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({ products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_90_MIN_MARKET));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

      const MY_BETS_SETTLED_URL = "mybets/settled/mb-736574746c6564";
      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_SETTLED_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4847]_the_90_min_payout_label_should_be_displayed`);
    });

    it("[PRPI-4847]_the_90_min_payout_label_should_be_displayed", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4847]_the_90_min_payout_label_should_be_displayed`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
