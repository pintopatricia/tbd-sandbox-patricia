const {
  MyBetsPagePO,
  MyBetsHeaderPO,
  ReceiptPanelPO,
  SegmentedControlPO,
  PrimaryButtonPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../mocks/webserver/webserver-controller");
const { getMockFonts } = require("../../mocks/fonts/fonts-controller");

const routes = require("../../../utils/routes");
const { waitForClickable } = require("../../helpers/cashout.util");
const MockService = require("../../helpers/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const primaryButtonPO = new PrimaryButtonPO();
const cashoutReceiptPO = new ReceiptPanelPO();

const CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1,
    currentLiability: 1,
    profit: "0",
  },
];

const CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1.1,
    currentLiability: 1,
    profit: 0.1,
  },
];

const CASHOUT_QUOTE_UNAVAILABLE_MOCK = [
  {
    marketId: "1.11111111",
    status: "UNAVAILABLE",
  },
];

const generateBetCardGroupMock = ({ isUnmatched, numBets, numOfUnmatched = 0, isQuoteUnavailable }) => {
  const BETS = [
    {
      __typename: "MarketBetSelectionCard",
      id: "111111111111",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: (isUnmatched && "1970-01-01T00:00:00.000Z") || "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 1,
      selectionId: 44444444,
      isUnmatched: isUnmatched || "false",
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "2222222222222",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: (isUnmatched && "1970-01-01T00:00:00.000Z") || "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "LAY",
      size: 0.9,
      profit: 1.1,
      selectionId: 44444444,
      isUnmatched: isUnmatched || "false",
      isCashout: true,
    },
  ];

  return [
    {
      aggregatorDesc: "Sporting Lisbon v Rio Ave",
      edges: [
        {
          __typename: "FixtureCard",
          homeName: "Sporting Lisbon",
          awayName: "Rio Ave",
          scheduledAt: "2023-09-25T19:15:00Z",
        },
        {
          __typename: "MarketBetCardGroup",
          edges:
            (numBets && [
              {
                __typename: "MarketBetCard",
                description: "Match Odds",
                numOfOrders: numBets,
                numOfUnmatched,
                ...((!isUnmatched && { liability: isQuoteUnavailable ? 0 : 1 }) || {}),
                ...((!isUnmatched && {
                  cashoutQuotes: isQuoteUnavailable
                    ? CASHOUT_QUOTE_UNAVAILABLE_MOCK
                    : CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK,
                }) ||
                  {}),
              },
              {
                __typename: "MarketBetExpandableCardGroup",
                isOpen: !!isUnmatched,
                edges: [
                  {
                    __typename: "MarketBetSelectionCardGroup",
                    edges: BETS.slice(0, numBets),
                  },
                ],
              },
            ]) ||
            [],
        },
      ],
    },
  ];
};

const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const segmentedControlPO = new SegmentedControlPO(myBetsHeaderPO.orderStatusFilter);

const MATCHED_FOOTBALL_EVENT_1_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 1,
});

const MATCHED_FOOTBALL_EVENT_2_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 2,
  isQuoteUnavailable: true,
});

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_1_BET_MOCK, {
  isOpenMatched: true,
  hasFooter: true,
});

const MODULE_NAME = "my_bets_exc";

describe("My Bets Page - EXC Cashout", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());

    await mockService.mockHttpRequest(await getIndexHTML(VIEW_MATCHED_FOOTBALL_MOCK.urn));
    await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
    await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));

    await browser.url(routes.getMyBetsViewUrl("open", { matchedStatus: "matched" }));

    await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");

    await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash Out Button is not visible");

    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1418]_should_display_the_cashout_button_with_the_correct_info_on_EXC_market_card`,
    );
  });

  describe("when the user opens My Bets matched bets and has a EXC market card with cashout", () => {
    it("[PRPI-1418]_should_display_the_cashout_button_with_the_correct_info_on_EXC_market_card", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1418]_should_display_the_cashout_button_with_the_correct_info_on_EXC_market_card`,
        ),
      ).toBe(0);
    });

    describe("and the user clicks on the cashout button", () => {
      describe("and it's unsuccessful", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK));
          await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "CASHOUT_FAILED" }));

          await browser.tickFakeClock();

          await waitForClickable(primaryButtonPO.element);
          await primaryButtonPO.element.click();

          await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cashout receipt is not displayed");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1419]_should_display_the_cashout_receipt_with_the_error_message`,
          );
        });

        afterAll(async () => {
          await cashoutReceiptPO.dismissButton.waitForClickable();
          await cashoutReceiptPO.dismissButton.click();
          await browser.waitUntilNotDisplayed(cashoutReceiptPO.element, "Cashout receipt is still displayed");
        });

        it("[PRPI-1419]_should_display_the_cashout_receipt_with_the_error_message", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1419]_should_display_the_cashout_receipt_with_the_error_message`,
            ),
          ).toBe(0);
        });
      });

      describe("and it's successful", () => {
        beforeAll(async () => {
          const [
            {
              edges: [, MARKET_BET_CARD_GROUP],
            },
          ] = MATCHED_FOOTBALL_EVENT_2_BET_MOCK;

          const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
            eventId: 1111111111,
            marketId: "1.11111111",
            isOpenMatched: true,
          });

          await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
          await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

          await waitForClickable(primaryButtonPO.element);
          await primaryButtonPO.element.click();

          await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1420]_should_display_the_cashout_with_the_success_message`,
          );
        });

        it("[PRPI-1420]_should_display_the_cashout_with_the_success_message", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1420]_should_display_the_cashout_with_the_success_message`),
          ).toBe(0);
        });
      });
    });
  });
});
