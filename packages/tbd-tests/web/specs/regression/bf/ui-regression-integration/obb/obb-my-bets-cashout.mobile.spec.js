const { MyBetsHeaderPO, PrimaryButtonPO, PNLAndWhatIfPO } = require("../../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  FCQ: { getBetQuotes },
  CASHOUT: { getTakeSBKCashoutResponse },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { MyBetsPagePO } = require("../../../../../page-objects");

const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const primaryButtonPO = new PrimaryButtonPO();
const primaryButtonPnlPO = new PNLAndWhatIfPO(primaryButtonPO.element);

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

const OBB_SINGLE_CASHOUT_MOCK = getMyBetsSBKViewMock([
  {
    profitAndLoss: 0.17,
    betType: "SGL",
    isOpen: true,
    currentSize: 0.1,
    betId: "1111111111",
    product: "OUTCOME_BASED_BETTING",
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

              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "participantsCombined",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      {
                        id: "404040",
                        name: "Rubén",
                      },
                      { id: "404041", name: "Neves" },
                    ],
                  },
                  params: {
                    outcomeIds: ["GOALS"],
                    timePeriodId: "MATCH",
                    participantIds: ["404040", "404041"],
                    value: 7,
                    quantifier: "MORE_THAN",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                      {
                        operator: "+",
                      },
                      {
                        outcomeId: "GOALS",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        decimal: 7,
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
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

const FCQ_QUOTE_NOT_ELIGIBLE_MOCK = {
  betId: "1111111111",
  quoteStatus: "NOT_ELIGIBLE",
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn, { products: ["sportsbook"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await browser.url(routes.getMyBetsViewUrl("open"));
};

describe("My Bets Page - OBB Cashout", () => {
  describe("When the user has an open obb bet with cashout available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));

      await browseToMyBets(OBB_SINGLE_CASHOUT_MOCK);

      await browser.waitUntilDisplayed(myBetsHeaderPO.header);
      await browser.waitUntilDisplayed(primaryButtonPO.element);
    });
    it("[PRPI-1639] should display the cashout button with the correct data", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $0.10");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.00");
    });

    describe("[GRNFLDS-61] and when the FCQ quote becomes not eligible", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_NOT_ELIGIBLE_MOCK));
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out");
      });

      it("[PRPI-7028] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Unavailable");
      });
    });
  });

  describe("When the user has an open bet with cashout available and clicks on the cashout button", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));

      await browseToMyBets(OBB_SINGLE_CASHOUT_MOCK);

      await browser.waitUntilDisplayed(myBetsHeaderPO.header);
      await browser.waitUntilDisplayed(primaryButtonPO.element);
    });
    describe("[GRNFLDS-63] and the cashout is successful", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getTakeSBKCashoutResponse({ respStatus: "SUCCESS", cashedOutQuote: 0.1 }));

        await primaryButtonPO.element.click();

        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
      });

      it("[PRPI-7029] should display the cashout button with the correct data", async () => {
        expect(await primaryButtonPO.label.getText()).toBe("Cash Out Successful");
        expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
        expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.00");
      });
    });
  });
});
