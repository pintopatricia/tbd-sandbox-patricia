const { MyBetsPagePO, SportsbookBetPanelPO, CardPO, StatusLabelPO } = require("../../../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const sbkBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);

const betStatusLabelPO = new StatusLabelPO(sbkBetPanelPO.element);

const cardPO = new CardPO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_MULTIPLE_BET_MOCK_OPEN = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    lowestEventStartTime: "2024-06-25T09:45:00.000Z",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Newcastle",
            awayName: "Brighton",
            scheduledAt: "2024-07-18T18:30:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Newcastle v Brighton",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Newcastle",
                },
              ],
            },
          ],
        },
        {
          footballFixture: {
            homeName: "Sevilla",
            awayName: "Juventus",
            scheduledAt: "2024-06-25T09:45:00.000Z",
          },
          legs: [
            {
              parts: [
                {
                  price: buildPrice(2.4),
                  originalPrice: buildPrice(2.4),
                  eventDescription: "Sevilla v Juventus",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Sevilla",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const browseToMyBets = async (MOCK, date) => {
  await mockService.mockHttpRequest(
    await getIndexHTML(MOCK.urn, {
      products: ["sportsbook"],
      MY_BETS_WIN_LOSE_VOID: { isActive: true },
      date,
    }),
  );
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
  await browser.waitUntilInViewport(cardPO.element);
};

describe("My bets Page (Open Bets) - Status Label - Date Indicator", () => {
  describe("When the user has a bet and the most recent event start date is further than 2 days from now", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_BET_MOCK_OPEN, "2024-06-18T09:45:00.000Z");
      await browser.waitUntilEquals(betStatusLabelPO.text, "6/25/24");
    });

    it("[PRPI-3663] should display the Status Label with the most recent date", async () => {
      expect(await betStatusLabelPO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelPO.text.getText()).toEqual("6/25/24");
    });
  });

  describe("When the user has a bet and the most recent event start date is tomorrow", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_BET_MOCK_OPEN, "2024-06-24T09:45:00.000Z");
      await browser.waitUntilEquals(betStatusLabelPO.text, "Tomorrow");
    });

    it("[PRPI-3664] should display the Status Label with 'Tomorrow'", async () => {
      expect(await betStatusLabelPO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelPO.text.getText()).toEqual("Tomorrow");
    });
  });

  describe("When the user has a bet and the most recent event start date is today", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_BET_MOCK_OPEN, "2024-06-25T07:45:00.000Z");
      await browser.waitUntilEquals(betStatusLabelPO.text, "Today");
    });

    it("[PRPI-3665] should display the Status Label with 'Today'", async () => {
      expect(await betStatusLabelPO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelPO.text.getText()).toEqual("Today");
    });
  });

  describe("When the user has a bet and the most recent event start date has already passed", () => {
    beforeAll(async () => {
      await browseToMyBets(SBK_MULTIPLE_BET_MOCK_OPEN, "2024-06-25T10:45:00.000Z");
      await browser.waitUntilEquals(betStatusLabelPO.text, "In Progress");
    });

    it("[PRPI-3666] should display the Status Label with 'In Progress'", async () => {
      expect(await betStatusLabelPO.element.isDisplayed()).toEqual(true);
      expect(await betStatusLabelPO.text.getText()).toEqual("In Progress");
    });
  });
});
