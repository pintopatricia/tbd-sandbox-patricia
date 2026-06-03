const { getMyBetsLayout, getAppContext, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const {
  FCQ: { getBetQuotes },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { BottomBarSO } = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

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

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(getAppContext({ products: ["SPORTSBOOK"] }));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));
  await startApp("home");
};

describe("My Bets Page - OBB Cashout", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getBetQuotes(FCQ_QUOTE_UPDATE_MOCK));
    await browseToMyBets(OBB_SINGLE_CASHOUT_MOCK);

    await browser.waitUntilClickableNative(BottomBarSO.myBets, "My bets button is not clickable");
    await BottomBarSO.myBets.click();

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-3717]_should_display_cashout_button`);
  });

  it("[PRPI-3717]_should_display_cashout_button", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-3717]_should_display_cashout_button`)).misMatchPercentage,
    ).toEqual(0);
  });
});
