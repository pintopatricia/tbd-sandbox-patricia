const { MyBetsHeaderPO, PrimaryButtonPO } = require("../../../../page-objects");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const {
  FCQ: { getBetQuotes },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { MyBetsPagePO } = require("../../../../page-objects");

const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();
const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const primaryButtonPO = new PrimaryButtonPO();

const MODULE_NAME = "obb_my_bets_cashout";

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

describe("My Bets Page - OBB Cashout", () => {
  describe("When the user has an open obb bet with cashout available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));
      await mockService.mockFonts(getMockFonts());

      await mockService.mockHttpRequest(await getIndexHTML(OBB_SINGLE_CASHOUT_MOCK.urn, { products: ["sportsbook"] }));
      await mockService.mockHttpRequest(getMyBetsLayout(OBB_SINGLE_CASHOUT_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(myBetsHeaderPO.header);
      await browser.waitUntilDisplayed(primaryButtonPO.element);
    });

    it("[PRPI-1639] should display the cashout button with the correct data", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1639]_should_display_cashout_button`)).toBe(0);
    });
  });
});
