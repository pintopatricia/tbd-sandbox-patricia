const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  FCQ: { getBetQuotes },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { startApp } = require("../../../../helpers/urls");

const MockService = require("../../../../mock-essentials/mocking-service");

const { MyBetsScreenSO, BottomBarSO, PrimaryButtonSO, PNLAndWhatIfSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();
const primaryButtonSO = new PrimaryButtonSO();
const primaryButtonProfitSO = new PNLAndWhatIfSO(primaryButtonSO.element);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const FCQ_QUOTE_UPDATE_MOCK = {
  betId: "1111111111",
  stake: 0.1,
  quote: 0.1,
  potentialWin: 0.17,
  originalPotentialWin: 0.17,
  cashOutToken: "cashOutToken=",
  refreshRate: 1,
  quoteStatus: "AVAILABLE",
};

const SBK_SINGLE_CASHOUT_MOCK = getMyBetsSBKViewMock([
  {
    profitAndLoss: 0.17,
    betType: "SGL",
    isOpen: true,
    currentSize: 0.1,
    betId: "1111111111",
    cashoutQuote: {
      __typename: "SportsbookCashoutQuote",
      urn: "ppb:sbkCashoutQuote:1111111111",
      betUrn: "ppb:sbkBet:1111111111",
      ...FCQ_QUOTE_UPDATE_MOCK,
    },
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Man Utd",
            awayName: "Chelsea",
            scheduledAt: "2023-05-25T19:00:00.000Z",
          },
          legs: [
            {
              type: "SS",
              parts: [
                {
                  price: buildPrice(1.65),
                  originalPrice: buildPrice(1.65),
                  priceType: "LIVE",
                  eventDescription: "Man Utd v Chelsea",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Man Utd",
                  startTime: "2023-05-25T19:00:00.000Z",
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

const FCQ_QUOTE_NEGATIVE_UPDATE_MOCK = {
  ...FCQ_QUOTE_UPDATE_MOCK,
  stake: 0.1,
  quote: 0.09,
};

const FCQ_QUOTE_POSITIVE_UPDATE_MOCK = {
  ...FCQ_QUOTE_UPDATE_MOCK,
  stake: 0.1,
  quote: 0.11,
};

const FCQ_QUOTE_SUSPENDED_MOCK = {
  ...FCQ_QUOTE_UPDATE_MOCK,
  stake: undefined,
  quote: undefined,
  quoteStatus: "SUSPENDED",
};

const FCQ_QUOTE_INPLAY_MARKET_NOT_ELIGIBLE_MOCK = {
  ...FCQ_QUOTE_UPDATE_MOCK,
  stake: undefined,
  quote: undefined,
  quoteStatus: "INPLAY_MARKET_NOT_ELIGIBLE",
};

const FCQ_QUOTE_NOT_ELIGIBLE_MOCK = {
  betId: "1111111111",
  quoteStatus: "NOT_ELIGIBLE",
};

describe("My Bets Page - Sportsbook Cashout", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        products: ["SPORTSBOOK"],
        throttles: {
          CASHOUT_SUSPENSION_REASONS: {
            isActive: true,
          },
        },
      }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_CASHOUT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));
    await startApp("home");

    await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
    await BottomBarSO.myBets.click();

    await browser.waitUntilDisplayed(myBetsSO.header);
    await browser.waitUntilDisplayed(primaryButtonSO.element);
  });

  describe("When the user has an open bet with cashout available", () => {
    it("[PRPI-3129] should display the cashout button with the correct data", async () => {
      expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $0.10");
      expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonProfitSO.pnl.getText()).toBe("$0.00");
    });

    describe("and when the FCQ quote updates to a negative value", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_NEGATIVE_UPDATE_MOCK));
        await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $0.09");
      });

      it("[PRPI-3130] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $0.09");
        expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
        expect(await primaryButtonProfitSO.pnl.getText()).toBe("-$0.01");
      });
    });

    describe("and when the FCQ quote becomes not eligible", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_NOT_ELIGIBLE_MOCK));
        await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out");
      });

      it("[PRPI-3131] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonSO.label.getText()).toBe("Cash Out");
        expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Unavailable");
      });
    });

    describe("and when the FCQ quote updates to a positive value", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_POSITIVE_UPDATE_MOCK));
        await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $0.11");
      });

      it("[PRPI-3132] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $0.11");
        expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
        expect(await primaryButtonProfitSO.pnl.getText()).toBe("$0.01");
      });
    });

    describe("and when the FCQ quote updates to a SUSPENDED quote", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_SUSPENDED_MOCK));
        await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out updating");
      });

      it("[PRPI-4800] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonSO.label.getText()).toBe("Cash Out updating");
        expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Due to a live event");
      });
    });

    describe("and when the FCQ quote updates to a INPLAY_MARKET_NOT_ELIGIBLE quote", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_INPLAY_MARKET_NOT_ELIGIBLE_MOCK));
        await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out");
      });

      it("[PRPI-4801] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonSO.label.getText()).toBe("Cash Out");
        expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Not available in-play");
      });
    });
  });
});
