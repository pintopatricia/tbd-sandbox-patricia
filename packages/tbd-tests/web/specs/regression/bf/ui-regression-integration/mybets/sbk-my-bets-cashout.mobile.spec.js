const {
  MyBetsHeaderPO,
  PrimaryButtonPO,
  PNLAndWhatIfPO,
  SnackbarPO,
  HeaderPO,
} = require("../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  FCQ: { getBetQuotes },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { MyBetsPagePO } = require("../../../../../page-objects");

const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const primaryButtonPO = new PrimaryButtonPO();
const primaryButtonPnlPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const snackbarPO = new SnackbarPO();
const headerPO = new HeaderPO();

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
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Man Utd",
            awayName: "Chelsea",
            scheduledAt: "2023-05-25T19:00:00.000Z",
          },
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

const FCQ_QUOTE_COOKIE_ERROR_MOCK = {
  betId: "1111111111",
  quoteStatus: "NOT_ELIGIBLE",
};

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

describe("My Bets Page - Sportsbook Cashout", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));
    await mockService.mockHttpRequest(
      await getIndexHTML(SBK_SINGLE_CASHOUT_MOCK.urn, {
        products: ["sportsbook"],
        CASHOUT_AUTH_REDIRECT: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getMyBetsLayout(SBK_SINGLE_CASHOUT_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await browser.url(routes.getMyBetsViewUrl("open"));

    await browser.waitUntilDisplayed(myBetsHeaderPO.header);
    await browser.waitUntilDisplayed(primaryButtonPO.element);
  });

  describe("When the user has an open bet with cashout available", () => {
    it("[PRPI-6850] should display the cashout button with the correct data", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $0.10");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.00");
    });

    describe("and when the FCQ quote updates to a negative value", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_NEGATIVE_UPDATE_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $0.09");
      });

      it("[PRPI-6851] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $0.09");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
        expect(await primaryButtonPnlPO.pnl.getText()).toBe("-$0.01");
      });
    });

    describe("and when the FCQ quote becomes not eligible", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_NOT_ELIGIBLE_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out");
      });

      it("[PRPI-6852] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Unavailable");
      });
    });

    describe("and when the FCQ quote updates to a positive value", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_POSITIVE_UPDATE_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $0.11");
      });

      it("[PRPI-6853] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $0.11");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
        expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.01");
      });
    });

    describe("and when the FCQ quote updates to a SUSPENDED quote", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_SUSPENDED_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out updating");
      });

      it("[PRPI-4800] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out updating");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Due to a live event");
      });
    });

    describe("and when the FCQ quote updates to a INPLAY_MARKET_NOT_ELIGIBLE quote", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_INPLAY_MARKET_NOT_ELIGIBLE_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out");
      });

      it("[PRPI-4801] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Not available in-play");
      });
    });
  });

  describe("[CNTBRY-24] When user authentication is not valid", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest({ ...getBetQuotes(FCQ_QUOTE_COOKIE_ERROR_MOCK), statusCode: 403 });
      await browser.waitUntilDisplayed(snackbarPO.element);
    });

    it("[PRPI-6854] should show alert to user informing the session has expired", async () => {
      expect(await snackbarPO.title.getText()).toBe("Your Session has expired");
    });

    describe("[CNTBRY-24] and the page should reload", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_MY_BETS_MOCK_FORBIDDEN_CARD.urn, {
            loggedIn: "false",
            products: ["sportsbook"],
            joinNowLabel: "Join Now",
          }),
        );
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK_FORBIDDEN_CARD));
        await browser.waitUntilDisplayed(headerPO.loginButton);
      });

      it("[PRPI-6855] should show My Bets page as logged out", async () => {
        expect(await headerPO.loginButton.isDisplayed()).toBe(true);
        expect(await headerPO.joinNowButton.isDisplayed()).toBe(true);
      });
    });
  });
});
