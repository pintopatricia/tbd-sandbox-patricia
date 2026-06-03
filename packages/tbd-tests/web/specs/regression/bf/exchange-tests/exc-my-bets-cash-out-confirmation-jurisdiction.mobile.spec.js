const {
  MyBetsPagePO,
  MyBetsHeaderPO,
  PNLAndWhatIfPO,
  PrimaryButtonPO,
  SegmentedControlPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);

const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);

const primaryButtonPO = new PrimaryButtonPO();
const primaryButtonPnlPO = new PNLAndWhatIfPO(primaryButtonPO.element);

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
      currentLiability: 1,
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
      currentLiability: 1,
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

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_1_BET_MOCK, {
  isOpenMatched: true,
});

const MATCHED_FOOTBALL_EVENT_2_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 2,
  isQuoteUnavailable: true,
});

const setupMatchedMyBets = async ({ jurisdiction, confirmCashout } = {}) => {
  await mockService.mockHttpRequest(
    await getIndexHTML(VIEW_MATCHED_FOOTBALL_MOCK.urn, {
      ...(jurisdiction && { jurisdiction }),
      ...(confirmCashout !== undefined && { confirmCashout }),
    }),
  );
  await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));

  await browser.url(routes.getMyBetsViewUrl("open"));

  await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet card group wasn't displayed");
  await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market bet card wasn't displayed");
  await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");
  await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash out button wasn't displayed");
  await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $1.00");
};

describe("My Bets - Cashout - Jurisdiction", () => {
  describe("when a user cashes out an Exchange matched bet via 'My Bets' page", () => {
    describe("when user is in Brazil jurisdiction", () => {
      beforeAll(async () => {
        await setupMatchedMyBets({ jurisdiction: "BRAZIL", confirmCashout: false });

        await waitForClickable(primaryButtonPO.element);
        await primaryButtonPO.element.click();
      });

      it("[PRPI-10374] should see the cashout confirmation screen", async () => {
        await browser.waitUntilEquals(primaryButtonPO.label, "Confirm: $1.00");
        await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Profit");
        await browser.waitUntilEquals(primaryButtonPnlPO.pnl, "$0.00");
      });
    });

    describe("when user is in any other jurisdiction", () => {
      describe("when 'Show Cash Out confirmation' setting is enabled", () => {
        beforeAll(async () => {
          await setupMatchedMyBets({ jurisdiction: "INTERNATIONAL", confirmCashout: true });

          await waitForClickable(primaryButtonPO.element);
          await primaryButtonPO.element.click();
        });

        it("[PRPI-10375] should see the cashout confirmation screen", async () => {
          await browser.waitUntilEquals(primaryButtonPO.label, "Confirm: $1.00");
          await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Profit");
          await browser.waitUntilEquals(primaryButtonPnlPO.pnl, "$0.00");
        });
      });

      describe("when 'Show Cash Out confirmation' setting is not enabled", () => {
        beforeAll(async () => {
          await setupMatchedMyBets({ jurisdiction: "INTERNATIONAL", confirmCashout: false });

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
          await browser.tickFakeClock();
        });

        it("[PRPI-10376] should not see the cashout confirmation screen", async () => {
          await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
          expect(await primaryButtonPO.element.isEnabled()).toBe(false);
        });
      });
    });
  });
});
